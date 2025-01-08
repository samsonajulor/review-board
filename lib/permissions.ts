import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface PermissionProps {
  table: dynamodb.Table;
  dlq: sqs.Queue;
}

export class PermissionConstruct extends Construct {
  constructor(scope: Construct, id: string, props: PermissionProps) {
    super(scope, id);

    this.attachPermissions = (fn: lambda.Function, actions: string[]) => {
      props.table.grantFullAccess(fn)

      props.dlq.grantSendMessages(fn);

      // Attach logging permissions
      fn.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
          resources: ['arn:aws:logs:*:*:*'],
        })
      );

      // Attach Comprehend permissions
      if (actions.includes('comprehend:DetectSentiment')) {
        fn.addToRolePolicy(
          new iam.PolicyStatement({
            actions: ['comprehend:DetectSentiment'],
            resources: ['*'],
          })
        );
      }
    };
  }

  public readonly attachPermissions: (fn: lambda.Function, actions: string[]) => void;
}
