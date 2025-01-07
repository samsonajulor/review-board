import * as cdk from 'aws-cdk-lib';
import { LambdaConstruct } from '../lib/lambda';
import { PermissionConstruct } from '../lib/permissions';
import { DynamoDBConstruct } from '../lib/dynamo';
import { Template } from 'aws-cdk-lib/assertions';

test('Lambda Functions Created with Correct Permissions', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  const dynamo = new DynamoDBConstruct(stack, 'DynamoDBConstruct');
  const permissions = new PermissionConstruct(stack, 'PermissionConstruct', {
    table: dynamo.table,
    dlq: new cdk.aws_sqs.Queue(stack, 'DLQ'),
  });

  new LambdaConstruct(stack, 'LambdaConstruct', { permissions });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 4);
});
