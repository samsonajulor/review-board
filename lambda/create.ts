import { Database } from './db';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');
const comprehendClient = new ComprehendClient({});

export const handler = async (event: any) => {
  try {
    const review = JSON.parse(event.body);

    // Sentiment Analysis
    const sentimentResult = await comprehendClient.send(
      new DetectSentimentCommand({
        Text: review.reviewText,
        LanguageCode: 'en',
      })
    );

    const item = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reviewText: review.reviewText,
      sentiment: sentimentResult.Sentiment,
      sentimentScore: sentimentResult.SentimentScore,
    };

    // Store in DynamoDB
    await db.putItem(item);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Review created',
        item,
      }),
    };
  } catch (error) {
    console.error('Error creating review:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create review' }),
    };
  }
};
