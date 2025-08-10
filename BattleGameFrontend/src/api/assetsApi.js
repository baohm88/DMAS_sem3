import apiClient from "./apiClient";

export const getAssets = () => apiClient.get("/assets");
export const getAsset = (id) => apiClient.get(`/assets/${id}`);
export const createAsset = (asset) => apiClient.post("/assets", asset);
export const updateAsset = (id, asset) => apiClient.put(`/assets/${id}`, asset);
export const deleteAsset = (id) => apiClient.delete(`/assets/${id}`);
