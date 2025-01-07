import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Database } from './db';
import { logger } from './logger';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');

export const handler = async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
  logger.addContext(context); // Correct usage of addContext
  logger.info('Received event', { event });

  try {
    const id = event.pathParameters?.id;

    if (id) {
      const result = await db.getItem({ id });
      logger.info('Retrieved review', { result });

      if (!result.Item) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Review not found' }) };
      }

      return { statusCode: 200, body: JSON.stringify(result.Item) };
    }

    const result = await db.scanTable();
    logger.info('Retrieved all reviews', { result });

    return { statusCode: 200, body: JSON.stringify(result.Items) };
  } catch (error) {
    logger.error('Error retrieving review', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve review' }),
    };
  }
};
