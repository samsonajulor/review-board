import * as cdk from 'aws-cdk-lib';
import { CognitoConstruct } from '../lib/cognito';
import { Template } from 'aws-cdk-lib/assertions';

test('Cognito User Pool and Client Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  new CognitoConstruct(stack, 'CognitoConstruct');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Cognito::UserPool', {
    UserPoolName: 'ReviewBoardUserPool',
  });

  template.hasResourceProperties('AWS::Cognito::UserPoolClient', {});
});
