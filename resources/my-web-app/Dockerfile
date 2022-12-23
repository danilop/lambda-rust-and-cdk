# Build Stage
FROM public.ecr.aws/docker/library/rust:latest AS builder

RUN apt-get -y update && apt-get -y upgrade && apt-get -y install python3 python3-pip
RUN pip3 install cargo-zigbuild
RUN cargo install cargo-lambda

WORKDIR /app
COPY . /app

RUN cargo lambda build --release --arm64

# Bundle Stage
FROM public.ecr.aws/docker/library/debian:stable-slim

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.6.0 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /app
COPY --from=builder /app/target/lambda/my-web-app/bootstrap /app

CMD ["/app/bootstrap"]

EXPOSE 8080