import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

interface PermissionProps {
  table: dynamodb.Table;
  dlq: sqs.Queue;
}

export class PermissionConstruct extends Construct {
  constructor(scope: Construct, id: string, props: PermissionProps) {
    super(scope, id);

    this.attachSharedPermissions = (fn: lambda.Function) => {
      fn.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
          resources: ['arn:aws:logs:*:*:*'],
        })
      );

      props.dlq.grantSendMessages(fn);
    };

    this.attachDynamoPermissions = (fn: lambda.Function, actions: string[]) => {
      fn.addToRolePolicy(
        new iam.PolicyStatement({
          actions,
          resources: [props.table.tableArn, `${props.table.tableArn}/index/*`],
        })
      );
    };

    this.attachComprehendPermissions = (fn: lambda.Function) => {
      fn.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['comprehend:DetectSentiment'],
          resources: ['*'],
        })
      );
    };
  }

  public readonly attachSharedPermissions: (fn: lambda.Function) => void;
  public readonly attachDynamoPermissions: (fn: lambda.Function, actions: string[]) => void;
  public readonly attachComprehendPermissions: (fn: lambda.Function) => void;
}
