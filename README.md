# Lambda, Rust, and CDK

This is an [AWS CDK](https://aws.amazon.com/cdk/) project in [TypeScript](https://www.typescriptlang.org) building two [AWS Lambda](https://aws.amazon.com/lambda/) functions developed using [Rust](https://www.rust-lang.org). It's meant as a showcase to share my experience of using Rust with AWS Lambda. I am interested in Rust because it is a very secure and efficient programming language.

## Contents

The two Lambda functions are in the `/resources` folder:

- `my-function` is a Lambda function packaged using the ZIP format and written in Rust using the Lambda Rust Runtime that uses [Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html) to receive and respond to web requests.

- `my-web-app`  is a Lambda function [packaed as a container image](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-images.html) using the [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter) to run a Rust web app built using the [Actix Web](https://actix.rs) framework. This function is also using Lambda function URLs.

Rust is a very efficient programming language that allows the two functions to run with very little memory and CPU usage. For example, they are both configured with the [minimum allowed memory (128 MB)](https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-memory-console). Because Lambda allocates CPU power in proportion to the amount of memory configured, this is also the minimum configurable CPU power. Both functions are are still very performant with a response time of about 1-1.5ms and an initialization time (cold start) of ~20ms for `my-function` and ~400ms for `my-web-app`.

The description of the stack is in the `/lib/my-project-stack.ts` file. This includes instructions to build `my-function` using a bundling container.

The instructions to build `my-web-app` are in the `/resources/my-web-app/Dockerfile`. The Dockerfile uses a [multi-stage build](https://docs.docker.com/build/building/multi-stage/) to create an executable that is then passed to the final image. The only difference here to make this container image run in AWS Lambda is the `COPY` command from the Lambda Web Adapter image.

The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Requirements

To deploy this app (including the two Lambda functions) you need:

- [Docker](https://www.docker.com), see [installation instructions](https://docs.docker.com/get-docker/).

- AWS CDK, see the [getting started guide](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html). The CDK needs access to [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) that have the necessary permissions to do the deployment. I used the `AdministratorAccess` [AWS managed policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html).

- [Node.js](https://nodejs.org/) with the `npm` command to install CDK dependencies.

Rust and its compiler are not a requirement because duing the building process they are used inside containers.

## Deployment

Use `npm install` to install CDK dependencies.

Then run `cdk deploy` and follow the interactive instructions.

## Useful commands for the CDK project

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
