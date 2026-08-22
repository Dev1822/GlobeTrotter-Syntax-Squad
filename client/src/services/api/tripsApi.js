import apiClient from "./client";

export const tripsApi = {
  getAll: (params = { page: 1, limit: 20 }) =>
    apiClient.get("/trips", { params }),
  getById: (id) => apiClient.get(`/trips/${id}`),
  create: (data) => apiClient.post("/trips", data),
  update: (id, data) => apiClient.put(`/trips/${id}`, data),
  delete: (id) => apiClient.delete(`/trips/${id}`),
  addStop: (tripId, data) => apiClient.post(`/trips/${tripId}/stops`, data),
  reorderStops: (tripId, stops) => apiClient.put(`/trips/${tripId}/stops/reorder`, { stops }),
  addActivity: (stopId, data) => apiClient.post(`/trips/stops/${stopId}/activities`, data),
  generateShareLink: (id) => apiClient.post(`/trips/${id}/share`),
  toggleSharing: (id) => apiClient.put(`/trips/${id}/share-toggle`),
  getSharedTrip: (token) => apiClient.get(`/trips/share/${token}`),
  copyTrip: (id) => apiClient.post(`/trips/${id}/copy`),
};

export default tripsApi;
