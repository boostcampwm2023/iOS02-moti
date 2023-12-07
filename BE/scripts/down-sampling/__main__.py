import os

import boto3
import requests
import pyheif
from PIL import Image

service_name: str = 's3'
endpoint_url: str = 'https://kr.object.ncloudstorage.com'
motimate_url: str = 'https://www.motimate.site'


def get_access_token(email: str, password: str):
    auth_path = f"{motimate_url}/api/v1/admin/login"
    response = requests.post(auth_path, data={"email": email, "password": password}, timeout=5)
    return response.json()['data']['accessToken']


def get_filename_without_extension(file_path: str):
    base_name = os.path.basename(file_path)
    file_name, file_extension = os.path.splitext(base_name)
    return (file_name, file_extension)


def is_heic_or_heif(file_path: str) -> bool:
    with open(file_path, 'rb') as file:
        signature = file.read(20)

    return signature[16:20] in [b'heic', b'heix', b'mif1', b'msf1']


def request_thumbnail_upload(token: str, thumbnail_id, thumbnail_path: str):
    upload_path = f"{motimate_url}/api/v1/images/{thumbnail_id}/thumbnails"
    res = requests.post(upload_path, {'thumbnailUrl': thumbnail_path}, headers={"Authorization": f"Bearer {token}"}, timeout=5)

    return res.status_code == 204


def downsample_image(input_path: str, output_path: str, downsample_size = (500, 500)):
    if not os.path.exists(os.path.dirname(output_path)):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
    if is_heic_or_heif(input_path):
        heif = pyheif.read(input_path)
        (file_name, file_extension) = get_filename_without_extension(output_path)
        output_path = f"./thumbnail/{file_name}.jpeg"
        img = Image.frombytes(heif.mode, heif.size, heif.data, 'raw', heif.mode, heif.stride)
    else:
        img = Image.open(input_path)

    downsampled_img: Image.Image = img.resize(downsample_size, Image.Resampling.LANCZOS)
    downsampled_img.save(output_path)
    (upload_filename, ext) = get_filename_without_extension(output_path)
    return (output_path, f"./{upload_filename}{ext}")


def main(args):
    bucket_name: str = args['container_name']
    thumbnail_bucket: str = f"{args['container_name']}-thumbnail"
    object_name: str = args['object_name']
    filename, extension = get_filename_without_extension(object_name)

    admin_email: str = args['motimate_admin_email']
    admin_password: str = args['motimate_admin_password']


    s3: boto3 = boto3.client(
        service_name,
        endpoint_url=endpoint_url,
        aws_access_key_id=args['access_key'],
        aws_secret_access_key=args['scret_key'],
    )

    object_path: str = f"./{object_name}"
    tmp_thumbnail_path: str = f"./thumbnail/{object_name}"

    s3.download_file(bucket_name, object_name, object_path)
    (stored_thumbnail_path, upload_thumbnail_path) = downsample_image(object_path, tmp_thumbnail_path)
    s3.upload_file(stored_thumbnail_path, thumbnail_bucket, upload_thumbnail_path, ExtraArgs={'ACL': 'public-read'})

    motimate_auth_token = get_access_token(admin_email, admin_password)
    request_thumbnail_upload(motimate_auth_token, filename, f"https://{thumbnail_bucket}.kr.object.ncloudstorage.com/{upload_thumbnail_path}")

    return args
