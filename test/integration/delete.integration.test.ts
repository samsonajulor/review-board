import { apiClient, getAdminToken, getUserToken } from '../test-utils';

describe('Delete Review Integration Tests', () => {
  it('should allow an admin to delete a review', async () => {
    const token = getAdminToken();
    const reviewId = '12345'; // Replace with a valid ID from your database

    const response = await apiClient.delete(`/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Review deleted');
  });

  it('should deny access for a non-admin user', async () => {
    const token = getUserToken();
    const reviewId = '12345'; // Replace with a valid ID from your database

    try {
      await apiClient.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.error).toBe('Access Denied');
    }
  });

  it('should return 404 for a non-existent review ID', async () => {
    const token = getAdminToken();
    const invalidReviewId = 'non-existent-id';

    try {
      await apiClient.delete(`/reviews/${invalidReviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.error).toBe('Review not found');
    }
  });
});
