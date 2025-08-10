import apiClient from "./apiClient";

export const getPlayers = () => apiClient.get("/players");
export const getPlayer = (id) => apiClient.get(`/players/${id}`);
export const createPlayer = (player) => apiClient.post("/players", player);
export const updatePlayer = (id, player) =>
    apiClient.put(`/players/${id}`, player);
export const deletePlayer = (id) => apiClient.delete(`/players/${id}`);
