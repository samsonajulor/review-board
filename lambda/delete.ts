import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Database } from './db';
import { logger } from './logger';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  logger.addContext(context);
  logger.info('Received event', { event });

  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing review ID' }) };
    }

    await db.deleteItem({ id });
    logger.info('Deleted review from database', { id });

    return { statusCode: 200, body: JSON.stringify({ message: 'Review deleted' }) };
  } catch (error) {
    logger.error('Error deleting review', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete review' }),
    };
  }
};
