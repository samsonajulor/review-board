import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejsfunction from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { PermissionConstruct } from './permissions';
import * as path from 'path';

interface LambdaProps {
  permissions: PermissionConstruct;
}

export class LambdaConstruct extends Construct {
  public readonly createReviewFn: lambda.Function;
  public readonly getReviewFn: lambda.Function;
  public readonly updateReviewFn: lambda.Function;
  public readonly deleteReviewFn: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const dlq = new sqs.Queue(this, 'DLQ', {
      queueName: 'ReviewBoardDLQ',
    });

    const createLambda = (id: string, handler: string) =>
      new nodejsfunction.NodejsFunction(this, id, {
        runtime: lambda.Runtime.NODEJS_20_X,
        functionName: `reviewBoard_${handler}`,
        handler: `handler`,
        entry: path.join(__dirname, `../lambda/${handler}.ts`),
        environment: {
          TABLE_NAME: process.env.TABLE_NAME || 'ReviewsTable',
        },
        deadLetterQueue: dlq,
        bundling: {
          externalModules: [
            '@aws-lambda-powertools/commons',
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
            '@aws-lambda-powertools/tracer',
          ],
          forceDockerBundling: false,
        },
      });

    this.createReviewFn = createLambda('CreateReviewFunction', 'create');
    this.getReviewFn = createLambda('GetReviewFunction', 'get');
    this.updateReviewFn = createLambda('UpdateReviewFunction', 'update');
    this.deleteReviewFn = createLambda('DeleteReviewFunction', 'delete');

    // Attach Permissions
    props.permissions.attachSharedPermissions(this.createReviewFn);
    props.permissions.attachDynamoPermissions(this.createReviewFn, ['dynamodb:PutItem']);
    props.permissions.attachComprehendPermissions(this.createReviewFn);

    props.permissions.attachSharedPermissions(this.getReviewFn);
    props.permissions.attachDynamoPermissions(this.getReviewFn, ['dynamodb:GetItem', 'dynamodb:Query']);

    props.permissions.attachSharedPermissions(this.updateReviewFn);
    props.permissions.attachDynamoPermissions(this.updateReviewFn, ['dynamodb:UpdateItem']);

    props.permissions.attachSharedPermissions(this.deleteReviewFn);
    props.permissions.attachDynamoPermissions(this.deleteReviewFn, ['dynamodb:DeleteItem']);
  }
}
