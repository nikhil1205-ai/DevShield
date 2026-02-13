import re

def detect_leaks(body):

    leaks = []

    emails = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", body)
    if emails:
        leaks.append({"type": "Email Exposure", "data": emails})

    aws_keys = re.findall(r"AKIA[0-9A-Z]{16}", body)
    if aws_keys:
        leaks.append({"type": "AWS Key Exposure", "data": aws_keys})

    jwt = re.findall(r"eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+", body)
    if jwt:
        leaks.append({"type": "JWT Exposure", "data": jwt})

    return leaks
