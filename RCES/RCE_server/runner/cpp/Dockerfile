FROM gcc:latest

WORKDIR /app

COPY main.cpp .
COPY input.txt .

RUN g++ main.cpp -o main

CMD ["sh", "-c", "./main < input.txt > output.txt"]

