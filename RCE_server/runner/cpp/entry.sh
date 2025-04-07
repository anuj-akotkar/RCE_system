#!/bin/bash

# Compile
g++ main.cpp -o main
if [ $? -ne 0 ]; then
  echo "Compilation Failed"
  exit 1
fi

# Run with input file
timeout 2s ./main < input.txt > output.txt
