import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { PermissionConstruct } from './permissions';
import * as path from 'path';

interface LambdaProps {
  permissions: PermissionConstruct;
  table: dynamodb.Table;
}

export class LambdaConstruct extends Construct {
  public readonly createReviewFn: lambda.Function;
  public readonly getReviewFn: lambda.Function;
  public readonly updateReviewFn: lambda.Function;
  public readonly deleteReviewFn: lambda.Function;
  public readonly getReviewFnWithId: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const dlq = new sqs.Queue(this, 'DLQ', {
      queueName: 'ReviewBoardDLQ',
    });

    const lambdaRole = new iam.Role(this, `LambdaRole`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    props.table.grantReadWriteData(lambdaRole);

    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    const createLambda = (id: string, handler: string): lambda.Function =>
      new lambda.Function(this, id, {
        runtime: lambda.Runtime.NODEJS_18_X,
        functionName: id,
        handler: `lambda/${handler}`,
        code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
        environment: {
          TABLE_NAME: props.table.tableName,
        },
        deadLetterQueue: dlq,
        role: lambdaRole,
      });

    this.createReviewFn = createLambda('CreateReviewFunction', 'create.lambdaHandler');
    this.getReviewFn = createLambda('GetReviewFunction', 'get.lambdaHandler');
    this.getReviewFnWithId = createLambda('GetReviewFunctionWithId', 'get.lambdaHandler');
    this.updateReviewFn = createLambda('UpdateReviewFunction', 'update.handler');
    this.deleteReviewFn = createLambda('DeleteReviewFunction', 'delete.handler');

    props.permissions.attachPermissions(this.createReviewFn, ['comprehend:DetectSentiment']);
  }
}
