import { Database } from './db';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id;
    if (id) {
      const result = await db.getItem({ id });
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    } else {
      const result = await db.scanTable();
      return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch reviews' }),
    };
  }
};
