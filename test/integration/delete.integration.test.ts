import { getAdminToken, apiClient, getUserToken } from "../test-utils";

describe('Delete Review Integration Tests', () => {
  it('should allow an admin to delete a review', async () => {
    const token = getAdminToken();

    const response = await apiClient.delete('/reviews/12345', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Review deleted');
  });

  it('should deny access for a non-admin user', async () => {
    const token = getUserToken();

    try {
      await apiClient.delete('/reviews/12345', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.error).toBe('Access Denied');
    }
  });
});
