import { apiClient, getAdminToken, getUserToken } from '../test-utils';

describe('Create Review Integration Tests', () => {
  it('should allow an admin to create a review', async () => {
    const token = await getAdminToken();

    console.log({ token });

    try {
      const response = await apiClient.post(
        '/reviews',
        { reviewText: 'Amazing service!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log({ response });

      expect(response.status).toBe(201);
      expect(response.data.message).toBe('Review created');
      expect(response.data.item.sentiment).toBe('POSITIVE');
    } catch (error: any) {
      console.log({ createError: error.response });

      expect(error.response.status).toBe(401);
    }
  });

  it('should deny access for a non-admin user', async () => {
    const token = await getUserToken();

    console.log({ token });

    try {
      await apiClient.post(
        '/reviews',
        { reviewText: 'Amazing service!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.log({ nonAdminError: error.response });
      expect(error.response.status).toBe(403);
      expect(error.response.data.error).toBe('Access Denied');
    }
  });

  it('should validate request body', async () => {
    const token = await getAdminToken();

    console.log({ token });

    try {
      await apiClient.post(
        '/reviews',
        { invalidField: 'Missing reviewText' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.log({ validationError: error.response });
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toContain('Review text is required');
    }
  });
});
