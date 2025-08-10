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
            const newPlayer = await createPlayer(player);
            setPlayers([...players, newPlayer]);
            return newPlayer;
        } catch (err) {
            throw err;
        }
    };

    const editPlayer = async (id, player) => {
        try {
            const updatedPlayer = await updatePlayer(id, player);
            setPlayers(
                players.map((p) => (p.playerId === id ? updatedPlayer : p))
            );
            return updatedPlayer;
        } catch (err) {
            throw err;
        }
    };

    const removePlayer = async (id) => {
        try {
            await deletePlayer(id);
            setPlayers(players.filter((p) => p.playerId !== id));
        } catch (err) {
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
