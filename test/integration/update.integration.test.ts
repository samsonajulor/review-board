import { getAdminToken, apiClient, getUserToken } from "../test-utils";

describe('Update Review Integration Tests', () => {
  it('should allow an admin to update a review', async () => {
    const token = getAdminToken();

    const response = await apiClient.put(
      '/reviews/12345',
      { reviewText: 'Updated review text!' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Review updated');
    expect(response.data.item.sentiment).toBe('POSITIVE');
  });

  it('should deny access for a non-admin user', async () => {
    const token = getUserToken();

    try {
      await apiClient.put(
        '/reviews/12345',
        { reviewText: 'Updated review text!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.error).toBe('Access Denied');
    }
  });
});
