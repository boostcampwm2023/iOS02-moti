import os

import boto3
from PIL import Image

service_name: str = 's3'
endpoint_url: str = 'https://kr.object.ncloudstorage.com'


def downsample_image(input_path: str, output_path: str, downsample_size: tuple[int, int] = (500, 500)):
    if not os.path.exists(os.path.dirname(output_path)):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with Image.open(input_path) as img:
        downsampled_img: Image.Image = img.resize(downsample_size, Image.Resampling.LANCZOS)
        downsampled_img.save(output_path)


def main(args):
    bucket_name: str = args['container_name']
    object_name: str = args['object_name']

    s3: boto3 = boto3.client(
        service_name,
        endpoint_url=endpoint_url,
        aws_access_key_id=args['access_key'],
        aws_secret_access_key=args['scret_key'],
    )

    object_path: str = f"./{object_name}"
    thumbnail_path: str = f"./thumbnail/{object_name}"

    s3.download_file(bucket_name, object_name, object_path)
    downsample_image(object_path, thumbnail_path)
    s3.upload_file(thumbnail_path, bucket_name, thumbnail_path)

    return args