import { apiClient, getAdminToken, getUserToken } from '../test-utils';

describe('Update Review Integration Tests', () => {
  it('should allow an admin to update a review', async () => {
    const token = await getAdminToken();
    const reviewId = '1736318345543';

    const response = await apiClient.put(
      `/reviews/${reviewId}`,
      { reviewText: 'Updated review text!' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Review updated');
  });

  it('should deny access for a non-admin user', async () => {
    const token = await getUserToken();
    const reviewId = '1736318345543';

    try {
      await apiClient.put(
        `/reviews/${reviewId}`,
        { reviewText: 'Updated review text!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.log({ denyUpdateError: JSON.stringify(error.response.data) });
      expect(error.response.status).toBe(403);
      expect(error.response.data.error).toBe('Access Denied');
    }
  });

  it('should validate request body', async () => {
    const token = await getAdminToken();
    const reviewId = '1736318345543';

    try {
      await apiClient.put(
        `/reviews/${reviewId}`,
        { invalidField: 'Missing reviewText' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.log({ validateError: JSON.stringify(error.response.data) });
      expect(error.response.status).toBe(400);
      expect(error.response.data.details[0].message).toContain('Review text is required');
    }
  });
});
