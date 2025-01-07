import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { DynamoDBConstruct } from './dynamo';
import { CognitoConstruct } from './cognito';
import { LambdaConstruct } from './lambda';
import { ApiGatewayConstruct } from './apigateway';
import { PermissionConstruct } from './permissions';

export class ReviewBoardStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGatewayLogsRole = new iam.Role(this, 'ApiGatewayLogsRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs'),
      ],
    });

    // Create DynamoDB Construct
    const dynamo = new DynamoDBConstruct(this, 'DynamoDBConstruct');

    // Create Cognito Construct
    const cognito = new CognitoConstruct(this, 'CognitoConstruct');

    // Create Permission Construct
    const permissions = new PermissionConstruct(this, 'PermissionConstruct', {
      table: dynamo.table,
      dlq: new cdk.aws_sqs.Queue(this, 'DLQ'),
    });

    // Create Lambda Construct
    const lambdas = new LambdaConstruct(this, 'LambdaConstruct', { permissions });

    // Create API Gateway Construct with logging role
    new ApiGatewayConstruct(this, 'ApiGatewayConstruct', {
      userPool: cognito.userPool,
      lambdas: {
        createReviewFn: lambdas.createReviewFn,
        getReviewFn: lambdas.getReviewFn,
        updateReviewFn: lambdas.updateReviewFn,
        deleteReviewFn: lambdas.deleteReviewFn,
      },
      logsRole: apiGatewayLogsRole,
    });
  }
}
