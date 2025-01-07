import { apiClient, getAdminToken, getUserToken } from '../test-utils';

describe('Create Review Integration Tests', () => {
  it('should allow an admin to create a review', async () => {
    const token = getAdminToken();

    const response = await apiClient.post(
      '/reviews',
      { reviewText: 'Amazing service!' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(201);
    expect(response.data.message).toBe('Review created');
    expect(response.data.item.sentiment).toBe('POSITIVE');
  });

  it('should deny access for a non-admin user', async () => {
    const token = getUserToken();

    try {
      await apiClient.post(
        '/reviews',
        { reviewText: 'Amazing service!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.error).toBe('Access Denied');
    }
  });

  it('should validate request body', async () => {
    const token = getAdminToken();

    try {
      await apiClient.post(
        '/reviews',
        { invalidField: 'Missing reviewText' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toContain('Review text is required');
    }
  });
});
