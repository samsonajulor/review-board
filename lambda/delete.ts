import { Database } from './db';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing review ID' }) };
    }

    await db.deleteItem({ id });

    return { statusCode: 200, body: JSON.stringify({ message: 'Review deleted' }) };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not delete review' }) };
  }
};
