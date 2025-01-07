import { handler } from '../lambda/create';
import { mockClient } from 'aws-sdk-client-mock';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);
const comprehendMock = mockClient(ComprehendClient);

beforeEach(() => {
  ddbMock.reset();
  comprehendMock.reset();
});

test('Create handler processes sentiment and saves review', async () => {
  ddbMock.on(PutCommand).resolves({});
  comprehendMock.on(DetectSentimentCommand).resolves({
    Sentiment: 'POSITIVE',
    SentimentScore: { Positive: 0.9, Neutral: 0.1, Negative: 0.0, Mixed: 0.0 },
  });

  const event = {
    body: JSON.stringify({ reviewText: 'Great service!' }),
  };

  const response = await handler(event);

  console.log({ response });

  expect(response.statusCode).toBe(201);
  const body = JSON.parse(response.body);
  expect(body.item.sentiment).toBe('POSITIVE');
  expect(body.item.sentimentScore.Positive).toBe(0.9);
});
