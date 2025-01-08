import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Database } from './db';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { logger } from './logger';
import middy from '@middy/core';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { reviewSchema } from '../validation/review.schema';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');
const comprehendClient = new ComprehendClient({});

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  logger.addContext(context);
  logger.info('Received event', { event });

  try {
    const body = JSON.parse(event.body || '{}');
    const { error } = reviewSchema.validate(body);
    if (error) {
      logger.error('Validation error', { error });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input', details: error.details }),
      };
    }

    logger.info('Parsed and validated review', { body });

    const command = new DetectSentimentCommand({
      Text: body.reviewText,
      LanguageCode: 'en',
    });

    const sentimentResult = await comprehendClient.send(command);
    logger.info('Sentiment analysis result', { sentimentResult });

    const item = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reviewText: body.reviewText,
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

export const lambdaHandler = middy(handler).use(injectLambdaContext(logger, { logEvent: true }));
