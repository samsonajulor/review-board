import { handler } from '../lambda/delete';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { mockContext } from './test-utils';
import { APIGatewayProxyEvent } from 'aws-lambda';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

test('Delete handler deletes a review', async () => {
  ddbMock.on(DeleteCommand).resolves({});

  const event = {
    pathParameters: { id: '12345' },
  } as unknown as APIGatewayProxyEvent;

  const response = await handler(event, mockContext);

  console.log({ response });

  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body.message).toBe('Review deleted');
});
