import { handler } from '../lambda/update';
import { mockClient } from 'aws-sdk-client-mock';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);
const comprehendMock = mockClient(ComprehendClient);

beforeEach(() => {
  ddbMock.reset();
  comprehendMock.reset();
});

test('Update handler updates sentiment and saves review', async () => {
  ddbMock.on(PutCommand).resolves({});
  comprehendMock.on(DetectSentimentCommand).resolves({
    Sentiment: 'NEUTRAL',
    SentimentScore: { Positive: 0.4, Neutral: 0.5, Negative: 0.1, Mixed: 0.0 },
  });

  const event = {
    pathParameters: { id: '12345' },
    body: JSON.stringify({
      reviewText: 'It was okay.',
      createdAt: '2025-01-01T12:00:00Z',
    }),
  };

  const response = await handler(event);

  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body.item.sentiment).toBe('NEUTRAL');
  expect(body.item.sentimentScore.Neutral).toBe(0.5);
  expect(body.item.id).toBe('12345');
});
