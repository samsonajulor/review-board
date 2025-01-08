import { apiClient, getAdminToken, getUserToken } from '../test-utils';

describe('Get Review Integration Tests', () => {
  it('should allow an admin to fetch all reviews', async () => {
    try {
      const token = await getAdminToken();

      const response = await apiClient.get('/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log({ response: JSON.stringify(response.data) });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    } catch (error) {
      console.error('Error fetching all reviews as admin:', error);
      throw error;
    }
  }, 10000);

  it('should allow a non-admin user to fetch all reviews', async () => {
    try {
      const token = await getUserToken();

      const response = await apiClient.get('/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log({ fetchNonAdmin: JSON.stringify(response.data) });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    } catch (error) {
      console.error('Error fetching all reviews as non-admin:', error);
      throw error;
    }
  }, 10000);

  it('should fetch a specific review by ID', async () => {
    const reviewId = '1736318345543';
    try {
      const token = await getAdminToken();

      const response = await apiClient.get(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log({ fetchByID: JSON.stringify(response.data)});

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(reviewId);
    } catch (error) {
      console.error(`Error fetching review with ID ${reviewId}:`, error);
      throw error;
    }
  }, 10000);
});
