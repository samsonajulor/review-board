import { Database } from './db';
import { ComprehendClient, DetectSentimentCommand } from '@aws-sdk/client-comprehend';
import { rbacMiddleware, validationMiddleware } from './middleware';
import { reviewSchema } from '../validation/review.schema';

const db = new Database(process.env.TABLE_NAME || 'ReviewsTable');
const comprehendClient = new ComprehendClient({});

export const handler = async (event: any) => {
  const rbacResult = await rbacMiddleware(['Admins'])(event, async () => {
    const validationResult = await validationMiddleware(reviewSchema)(event, async () => {
      try {
        const review = JSON.parse(event.body);

        const command = new DetectSentimentCommand({
          Text: review.reviewText,
          LanguageCode: 'en',
        });

        const sentimentResult = await comprehendClient.send(command);

        const item = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          reviewText: review.reviewText,
          sentiment: sentimentResult.Sentiment,
          sentimentScore: sentimentResult.SentimentScore,
        };

        await db.putItem(item);

        return { statusCode: 201, body: JSON.stringify({ message: 'Review created', item }) };
      } catch (error) {
        console.error('Error creating review:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Could not create review' }) };
      }
    });

    return validationResult;
  });

  return rbacResult;
};
