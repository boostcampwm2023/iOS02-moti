import sys

from requests import post
from requests_toolbelt.multipart.encoder import MultipartEncoder

base_url = "http://127.0.0.1:3000"


def get_access_token(id, password):
    url = f"{base_url}/api/v1/admin/login"
    response = post(url, data={"email": id, "password": password})
    return response.json()['data']['accessToken']


def send_multipart_request(token):
    url = f"{base_url}/api/v1/images"

    with open('./img_small.jpg', 'rb') as f:
        file_content = f.read()

    multipart_data = MultipartEncoder(
        fields={
            'image': ('img.jpg', file_content, 'image/jpeg')
        })

    response = post(
        url,
        data=multipart_data,
        headers={
            'Content-Type': multipart_data.content_type,
            'Authorization': f"Bearer {token}"
        }
    )
    return response


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python __main__.py [email] [password]")
        sys.exit(1)

    token = get_access_token(sys.argv[1], sys.argv[2])
    response = send_multipart_request(token)
    print(response.json())
