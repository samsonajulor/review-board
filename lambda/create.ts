import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Database } from './db';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { logger } from './logger';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');
const comprehendClient = new ComprehendClient({});

export const handler = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
  logger.addContext(context);
  logger.info('Received event', { event });

  try {
    const review = JSON.parse(event.body || '{}');
    logger.info('Parsed review', { review });

    const command = new DetectSentimentCommand({
      Text: review.reviewText,
      LanguageCode: 'en',
    });

    const sentimentResult = await comprehendClient.send(command);
    logger.info('Sentiment analysis result', { sentimentResult });

    const item = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reviewText: review.reviewText,
      sentiment: sentimentResult.Sentiment,
      sentimentScore: sentimentResult.SentimentScore,
    };

    await db.putItem(item);
    logger.info('Saved review to database', { item });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Review created', item }),
    };
  } catch (error) {
    logger.error('Error creating review', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create review' }),
    };
  }
};
