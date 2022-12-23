import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { LayerVersion, Tracing } from 'aws-cdk-lib/aws-lambda';
import { RustFunction } from 'cargo-lambda-cdk';

export class MyProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const target = 'aarch64-unknown-linux-musl';

    const myFunction = new lambda.Function(this, 'my-function', {
      description: "My Rust Lambda Function",
      runtime: lambda.Runtime.PROVIDED_AL2,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 128,
      code: lambda.Code.fromAsset(
        'resources/my-function/',
        {
          bundling: {
            image: cdk.DockerImage.fromRegistry('public.ecr.aws/docker/library/rust:slim'),
            command: [
              'bash', '-c',
              `rustup target add ${target} && ` +
              `cargo build --release --target ${target} && ` +
              `cp target/${target}/release/my-function /asset-output/bootstrap`
            ],
          }
        }
      ),
      handler: 'main',
      logRetention: RetentionDays.ONE_WEEK,
      tracing: Tracing.ACTIVE,
    });

    const myFunctionUrl = myFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

    const myWebApp = new lambda.DockerImageFunction(this, 'my-web-app', {
      description: "My Rust Web App",
      architecture: lambda.Architecture.ARM_64,
      memorySize: 128,
      code: lambda.DockerImageCode.fromImageAsset('resources/my-web-app'),
      logRetention: RetentionDays.ONE_WEEK,
      tracing: Tracing.ACTIVE,
    });

    const myWebAppUrl = myWebApp.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

  }
}
