import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { usePlayers } from "../hooks/usePlayers.js";
import { useAssets } from "../hooks/useAssets.js";
import { toast } from "react-toastify";
import PlayersTable from "../components/players/PlayersTable";
import FormModal from "../components/common/FormModal";
import PlayerForm from "../components/players/PlayerForm";
import ConfirmationModal from "../components/common/ConfirmationModal";
import FullPageSpinner from "../components/common/Spinner.jsx";

const PlayersPage = () => {
    const { players, loading, addPlayer, editPlayer, removePlayer } =
        usePlayers();
    const { assets } = useAssets();

    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        playerName: "",
        fullName: "",
        age: "",
        level: "",
        assetIds: [],
    });
    const [deleteId, setDeleteId] = useState(null);

    const handleShowModal = (player = null) => {
        if (player) {
            setEditId(player.playerId);
            setForm({
                playerName: player.playerName,
                fullName: player.fullName,
                age: player.age,
                level: player.level,
                assetIds: player.assetIds || [],
            });
        } else {
            setEditId(null);
            setForm({
                playerName: "",
                fullName: "",
                age: "",
                level: "",
                assetIds: [],
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectAssets = (selected) => {
        setForm({ ...form, assetIds: selected });
    };

    const handleSave = async () => {
        try {
            if (!form.playerName || !form.level || !form.age) {
                toast.error("All fields are required!");
                return;
            }

            // Prepare data for API
            const playerData = {
                playerName: form.playerName,
                fullName: form.fullName,
                age: parseInt(form.age) || 0,
                level: parseInt(form.level) || 1,
                assetIds: form.assetIds.map((id) => parseInt(id)), // Ensure IDs are numbers
            };

            if (editId) {
                await editPlayer(editId, playerData);
                toast.success("Player's info updated successfully!");
            } else {
                await addPlayer(playerData);
                toast.success("Player added successfully!");
            }
            handleCloseModal();
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to save player";
            console.error("Save error:", err);
            toast.error(`Error: ${errorMessage}`);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await removePlayer(deleteId);
            toast.success("Player deleted successfully!");
            setShowConfirm(false);
        } catch (err) {
            console.error("Failed to delete player:", err);
            toast.error(
                err.response?.data?.message || "Failed to delete player"
            );
        }
    };

    if (loading) {
        return <FullPageSpinner />;
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Battle Game Players</h1>
            <Button variant="primary" onClick={() => handleShowModal()}>
                Add Player
            </Button>

            <PlayersTable
                players={players}
                onEdit={handleShowModal}
                onDelete={handleDeleteClick}
            />

            <FormModal
                show={showModal}
                onHide={handleCloseModal}
                title={editId ? "Edit Player" : "Add Player"}
                onSave={handleSave}
            >
                <PlayerForm
                    form={form}
                    onChange={handleChange}
                    onSelectAssets={handleSelectAssets}
                    assets={assets}
                />
            </FormModal>

            <ConfirmationModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this player?"
            />
        </Container>
    );
};

export default PlayersPage;
