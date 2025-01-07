import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface ApiGatewayProps {
  userPool: cognito.UserPool;
  lambdas: {
    createReviewFn: lambda.Function;
    getReviewFn: lambda.Function;
    updateReviewFn: lambda.Function;
    deleteReviewFn: lambda.Function;
  };
}

export class ApiGatewayConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'ReviewBoardApi', {
      restApiName: 'ReviewBoard Service',
      deployOptions: {
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
    });

    const reviewsResource = api.root.addResource('reviews');
    const reviewIdResource = reviewsResource.addResource('{id}');

    const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      cognitoUserPools: [props.userPool],
    });

    // Attach API Gateway Methods
    reviewsResource.addMethod('POST', new apigateway.LambdaIntegration(props.lambdas.createReviewFn), {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    });

    reviewsResource.addMethod('GET', new apigateway.LambdaIntegration(props.lambdas.getReviewFn), {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    });

    reviewIdResource.addMethod('PUT', new apigateway.LambdaIntegration(props.lambdas.updateReviewFn), {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    });

    reviewIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(props.lambdas.deleteReviewFn), {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    });
  }
}
