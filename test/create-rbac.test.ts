import { lambdaHandler } from '../lambda/create';
import { mockEvent, mockContext } from './test-utils';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { ComprehendClient } from '@aws-sdk/client-comprehend';

const ddbMock = mockClient(DynamoDBDocumentClient);
const comprehendMock = mockClient(ComprehendClient);

beforeEach(() => {
  ddbMock.reset();
  comprehendMock.reset();
});

test('Create lambdaHandler denies access for non-admin users', async () => {
  const event = mockEvent({ 'cognito:groups': 'Users' });

  const response = await lambdaHandler(event, mockContext);

  expect(response.statusCode).toBe(403);
  const body = JSON.parse(response.body);
  expect(body.error).toBe('Access Denied');
});

test('Create lambdaHandler validates request body', async () => {
  const event = mockEvent({ 'cognito:groups': 'Admins' });
  event.body = JSON.stringify({}); // Invalid body

  const response = await lambdaHandler(event, mockContext);

  expect(response.statusCode).toBe(400);
  const body = JSON.parse(response.body);
  expect(body.error).toBe('Review text is required');
});
