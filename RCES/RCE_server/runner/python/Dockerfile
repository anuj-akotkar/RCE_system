# /runner/python/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Don’t copy main.py or input.txt here since they'll be mounted at runtime
CMD ["sh", "-c", "python3 main.py < input.txt > output.txt"]


