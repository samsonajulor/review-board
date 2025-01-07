import { handler } from '../lambda/delete';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

test('Delete handler deletes a review', async () => {
  ddbMock.on(DeleteCommand).resolves({});

  const event = {
    pathParameters: { id: '12345' },
  };

  const response = await handler(event);

  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body.message).toBe('Review deleted');
});
