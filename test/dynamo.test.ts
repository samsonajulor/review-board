import * as cdk from 'aws-cdk-lib';
import { DynamoDBConstruct } from '../lib/dynamo';
import { Template } from 'aws-cdk-lib/assertions';

test('DynamoDB Table with GSI Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  new DynamoDBConstruct(stack, 'DynamoDBConstruct');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::DynamoDB::Table', {
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
      { AttributeName: 'createdAt', KeyType: 'RANGE' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'SentimentIndex',
      },
    ],
  });
});
