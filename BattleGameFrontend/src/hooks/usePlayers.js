// src/hooks/usePlayers.js
import { useState, useEffect } from "react";
import {
    getPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
} from "../api/playersApi";

export const usePlayers = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const res = await getPlayers();

            setPlayers(Array.isArray(res?.data) ? res.data : []);
            setError(null);
        } catch (err) {
            setError(err.message);
            setPlayers([]); // đặt về mảng rỗng nếu báo lỗi
        } finally {
            setLoading(false);
        }
    };

    const addPlayer = async (player) => {
        try {
            // Convert data types to match backend
            const playerData = {
                ...player,
                age: parseInt(player.age) || 0,
                level: parseInt(player.level) || 0,
                assetIds: player.assetIds || [],
            };

            const { data } = await createPlayer(playerData);

            // Ensure the response contains the full player data
            const newPlayer = data;

            setPlayers((prev) => [...prev, newPlayer]);
            return newPlayer;
        } catch (err) {
            console.error(
                "Error adding player:",
                err.response?.data || err.message
            );
            throw err;
        }
    };

    const editPlayer = async (id, player) => {
        try {
            // Convert data types to match backend
            const playerData = {
                ...player,
                age: parseInt(player.age) || 0,
                level: parseInt(player.level) || 1,
                assetIds: player.assetIds || [],
            };

            const { data } = await updatePlayer(id, playerData);
            const updatedPlayer = data;

            // Update players with new data
            setPlayers((prev) =>
                prev.map((p) => (p.playerId === id ? updatedPlayer : p))
            );

            return updatedPlayer;
        } catch (err) {
            console.error(
                "Error updating player:",
                err.response?.data || err.message
            );
            throw err;
        }
    };

    const removePlayer = async (id) => {
        try {
            await deletePlayer(id);
            setPlayers(players.filter((p) => p.playerId !== id));
        } catch (err) {
            console.error(
                "Error deleting player:",
                err.response?.data || err.message
            );
            throw err;
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    return {
        players,
        loading,
        error,
        addPlayer,
        editPlayer,
        removePlayer,
        refresh: fetchPlayers,
    };
};
