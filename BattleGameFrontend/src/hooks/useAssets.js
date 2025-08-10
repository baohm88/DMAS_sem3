// src/hooks/useAssets.js
import { useState, useEffect } from "react";
import {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
} from "../api/assetsApi";

export const useAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await getAssets();
            setAssets(Array.isArray(res?.data) ? res.data : []);
            setError(null);
        } catch (err) {
            setError(err.message);
            setAssets([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addAsset = async (asset) => {
        try {
            const { data } = await createAsset(asset);
            setAssets([...assets, data]);
            return { data };
        } catch (err) {
            throw err;
        }
    };

    const editAsset = async (id, asset) => {
        try {
            const { data } = await updateAsset(id, asset);

            setAssets(assets.map((a) => (a.assetId === id ? data : a)));
            return data;
        } catch (err) {
            throw err;
        }
    };

    const removeAsset = async (id) => {
        try {
            await deleteAsset(id);
            setAssets(assets.filter((a) => a.assetId !== id));
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return {
        assets,
        loading,
        error,
        addAsset,
        editAsset,
        removeAsset,
        refresh: fetchAssets,
    };
};
