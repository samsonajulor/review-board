import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Database } from './db';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { logger } from './logger';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');
const comprehendClient = new ComprehendClient({});

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  logger.addContext(context);
  logger.info('Received event', { event });

  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing review ID' }) };
    }

    const updatedReview = JSON.parse(event.body || '{}');

    const command = new DetectSentimentCommand({
      Text: updatedReview.reviewText,
      LanguageCode: 'en',
    });

    const sentimentResult = await comprehendClient.send(command);
    logger.info('Sentiment analysis result', { sentimentResult });

    const item = {
      id,
      createdAt: updatedReview.createdAt || new Date().toISOString(),
      reviewText: updatedReview.reviewText,
      sentiment: sentimentResult.Sentiment,
      sentimentScore: sentimentResult.SentimentScore,
    };

    await db.putItem(item);
    logger.info('Updated review in database', { item });

    return { statusCode: 200, body: JSON.stringify({ message: 'Review updated', item }) };
  } catch (error) {
    logger.error('Error updating review', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update review' }),
    };
  }
};
