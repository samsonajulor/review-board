import * as cdk from 'aws-cdk-lib';
import { DynamoDBConstruct } from './dynamo';
import { CognitoConstruct } from './cognito';
import { LambdaConstruct } from './lambda';
import { ApiGatewayConstruct } from './apigateway';
import { PermissionConstruct } from './permissions';

export class ReviewBoardStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB
    const dynamo = new DynamoDBConstruct(this, 'DynamoDBConstruct');

    // Cognito
    const cognito = new CognitoConstruct(this, 'CognitoConstruct');

    // Permissions
    const permissions = new PermissionConstruct(this, 'PermissionConstruct', {
      table: dynamo.table,
      dlq: new cdk.aws_sqs.Queue(this, 'DLQ'),
    });

    // Lambda Functions
    const lambdas = new LambdaConstruct(this, 'LambdaConstruct', { permissions });

    // API Gateway
    new ApiGatewayConstruct(this, 'ApiGatewayConstruct', {
      userPool: cognito.userPool,
      lambdas: {
        createReviewFn: lambdas.createReviewFn,
        getReviewFn: lambdas.getReviewFn,
        updateReviewFn: lambdas.updateReviewFn,
        deleteReviewFn: lambdas.deleteReviewFn,
      },
    });
  }
}
