import { lambdaHandler } from '../lambda/get';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { mockContext } from './test-utils';
import { APIGatewayProxyEvent } from 'aws-lambda';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

test('Get lambdaHandler retrieves a specific review', async () => {
  ddbMock.on(GetCommand).resolves({
    Item: {
      id: '12345',
      reviewText: 'Amazing product!',
      sentiment: 'POSITIVE',
      sentimentScore: { Positive: 0.9, Neutral: 0.1, Negative: 0.0, Mixed: 0.0 },
    },
  });

  const event = {
    pathParameters: { id: '12345' },
  } as unknown as APIGatewayProxyEvent;;

  const response = await lambdaHandler(event, mockContext);

  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body.id).toBe('12345');
  expect(body.sentiment).toBe('POSITIVE');
});

test('Get lambdaHandler retrieves all reviews', async () => {
  ddbMock.on(ScanCommand).resolves({
    Items: [
      {
        id: '12345',
        reviewText: 'Amazing product!',
        sentiment: 'POSITIVE',
        sentimentScore: { Positive: 0.9, Neutral: 0.1, Negative: 0.0, Mixed: 0.0 },
      },
      {
        id: '67890',
        reviewText: 'Terrible service!',
        sentiment: 'NEGATIVE',
        sentimentScore: { Positive: 0.0, Neutral: 0.1, Negative: 0.9, Mixed: 0.0 },
      },
    ],
  });

  const event = {} as unknown as APIGatewayProxyEvent;;

  const response = await lambdaHandler(event, mockContext);

  console.log({ response });

  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body.length).toBe(2);
  expect(body[0].sentiment).toBe('POSITIVE');
  expect(body[1].sentiment).toBe('NEGATIVE');
});
