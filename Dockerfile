FROM ubuntu:latest
FROM python:3.10
LABEL authors="reedfu"

ENTRYPOINT ["top", "-b"]

# Setup for dependencies
RUN apt-get update
RUN apt-get install -y curl

# RUN pip install 
# Install Node16.20
SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
RUN source /root/.bashrc && nvm install 18.19 \
SHELL ["/bin/bash", "--login", "-c"]

# Copy the project
RUN mkdir -p /skynet/astromancer
COPY . /skynet/astromancer

# Install the project
WORKDIR /skynet/astromancer
RUN npm install

# Build the project
RUN npm run build

# Expose the port
EXPOSE 4201
