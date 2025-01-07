import { Database } from './db';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');
const comprehendClient = new ComprehendClient({});

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters.id;
    const updatedReview = JSON.parse(event.body);

    // Sentiment Analysis
    const sentimentResult = await comprehendClient.send(
      new DetectSentimentCommand({
        Text: updatedReview.reviewText,
        LanguageCode: 'en',
      })
    );

    const item = {
      id,
      reviewText: updatedReview.reviewText,
      sentiment: sentimentResult.Sentiment,
      sentimentScore: sentimentResult.SentimentScore,
    };

    // Update in DynamoDB
    const result = await db.updateItem(item);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Review updated',
        updatedAttributes: result.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error updating review:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update review' }),
    };
  }
};
