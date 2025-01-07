import { Database } from './db';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');
const comprehendClient = new ComprehendClient({});

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing review ID' }) };
    }

    const updatedReview = JSON.parse(event.body);

    const command = new DetectSentimentCommand({
      Text: updatedReview.reviewText,
      LanguageCode: 'en',
    });

    const sentimentResult = await comprehendClient.send(command);

    const item = {
      id,
      createdAt: updatedReview.createdAt || new Date().toISOString(),
      reviewText: updatedReview.reviewText,
      sentiment: sentimentResult.Sentiment,
      sentimentScore: sentimentResult.SentimentScore,
    };

    await db.putItem(item);

    return { statusCode: 200, body: JSON.stringify({ message: 'Review updated', item }) };
  } catch (error) {
    console.error('Error updating review:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not update review' }) };
  }
};
