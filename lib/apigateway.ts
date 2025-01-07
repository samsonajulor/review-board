import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiGatewayProps {
  userPool: cognito.IUserPool;
  lambdas: {
    createReviewFn: cdk.aws_lambda.IFunction;
    getReviewFn: cdk.aws_lambda.IFunction;
    updateReviewFn: cdk.aws_lambda.IFunction;
    deleteReviewFn: cdk.aws_lambda.IFunction;
  };
  logsRole: cdk.aws_iam.IRole;
}

export class ApiGatewayConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'ReviewBoardApi', {
      restApiName: 'ReviewBoardAPI',
      deployOptions: {
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
        accessLogDestination: new apigateway.LogGroupLogDestination(
          new cdk.aws_logs.LogGroup(this, 'ApiAccessLogs', {
            retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
          })
        ),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
      },
    });

    // Add Cognito Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [props.userPool],
    });

    // Define resources and methods
    const reviewsResource = api.root.addResource('reviews');
    reviewsResource.addMethod('POST', new apigateway.LambdaIntegration(props.lambdas.createReviewFn), { authorizer });

    reviewsResource.addMethod('GET', new apigateway.LambdaIntegration(props.lambdas.getReviewFn), { authorizer });

    const reviewResource = reviewsResource.addResource('{id}');
    reviewResource.addMethod('PUT', new apigateway.LambdaIntegration(props.lambdas.updateReviewFn), { authorizer });

    reviewResource.addMethod('DELETE', new apigateway.LambdaIntegration(props.lambdas.deleteReviewFn), { authorizer });
  }
}
