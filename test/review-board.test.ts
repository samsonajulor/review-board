import * as cdk from 'aws-cdk-lib';
import { ReviewBoardStack } from '../lib/review-board-stack';
import { Template } from 'aws-cdk-lib/assertions';

test('ReviewBoard Stack Creates All Resources', () => {
  const app = new cdk.App();
  const stack = new ReviewBoardStack(app, 'ReviewBoardStack');

  const template = Template.fromStack(stack);

  // Check DynamoDB Table
  template.resourceCountIs('AWS::DynamoDB::Table', 1);

  // Check Lambda Functions
  template.resourceCountIs('AWS::Lambda::Function', 4);

  // Check Cognito User Pool
  template.resourceCountIs('AWS::Cognito::UserPool', 1);

  // Check API Gateway
  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
});
