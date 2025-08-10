// // src/pages/PlayersPage.jsx
// import React, { useState } from "react";
// import { Container, Button } from "react-bootstrap";
// import { usePlayers } from "../hooks/usePlayers.js";
// import { useAssets } from "../hooks/useAssets.js";
// import PlayersTable from "../components/players/PlayersTable";
// import FormModal from "../components/common/FormModal";
// import PlayerForm from "../components/players/PlayerForm";
// import ConfirmationModal from "../components/common/ConfirmationModal";

// const PlayersPage = () => {
//     const { players, loading, addPlayer, editPlayer, removePlayer } =
//         usePlayers();

//     const { assets } = useAssets();

//     const [showModal, setShowModal] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [form, setForm] = useState({
//         playerName: "",
//         fullName: "",
//         age: "",
//         level: "",
//         assetIds: [],
//     });
//     const [deleteId, setDeleteId] = useState(null);

//     const handleShowModal = (player = null) => {
//         if (player) {
//             setEditId(player.playerId);
//             setForm({
//                 playerName: player.playerName,
//                 fullName: player.fullName,
//                 age: player.age,
//                 level: player.level,
//                 assetIds: player.assetIds || [],
//             });
//         } else {
//             setEditId(null);
//             setForm({
//                 playerName: "",
//                 fullName: "",
//                 age: "",
//                 level: "",
//                 assetIds: [],
//             });
//         }
//         setShowModal(true);
//     };

//     const handleCloseModal = () => setShowModal(false);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSelectAssets = (selected) => {
//         setForm({ ...form, assetIds: selected });
//     };

//     const handleSave = async () => {
//         try {
//             if (editId) {
//                 await editPlayer(editId, form);
//             } else {
//                 await addPlayer(form);
//             }
//             handleCloseModal();
//         } catch (err) {
//             console.error("Failed to save player:", err);
//         }
//     };

//     const handleDeleteClick = (id) => {
//         setDeleteId(id);
//         setShowConfirm(true);
//     };

//     const handleConfirmDelete = async () => {
//         try {
//             await removePlayer(deleteId);
//             setShowConfirm(false);
//         } catch (err) {
//             console.error("Failed to delete player:", err);
//         }
//     };

//     if (loading) {
//         return <p>Loading</p>;
//     }

//     return (
//         <Container className="mt-4">
//             <h1 className="mb-4">Battle Game Players</h1>
//             <Button variant="primary" onClick={() => handleShowModal()}>
//                 Add Player
//             </Button>

//             <PlayersTable
//                 players={players}
//                 onEdit={handleShowModal}
//                 onDelete={handleDeleteClick}
//             />

//             <FormModal
//                 show={showModal}
//                 onHide={handleCloseModal}
//                 title={editId ? "Edit Player" : "Add Player"}
//                 onSave={handleSave}
//             >
//                 <PlayerForm
//                     form={form}
//                     onChange={handleChange}
//                     onSelectAssets={handleSelectAssets}
//                     assets={assets}
//                 />
//             </FormModal>

//             <ConfirmationModal
//                 show={showConfirm}
//                 onHide={() => setShowConfirm(false)}
//                 onConfirm={handleConfirmDelete}
//                 title="Confirm Delete"
//                 message="Are you sure you want to delete this player?"
//             />
//         </Container>
//     );
// };

// export default PlayersPage;

import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { usePlayers } from "../hooks/usePlayers.js";
import { useAssets } from "../hooks/useAssets.js";
import { toast } from "react-toastify";
import PlayersTable from "../components/players/PlayersTable";
import FormModal from "../components/common/FormModal";
import PlayerForm from "../components/players/PlayerForm";
import ConfirmationModal from "../components/common/ConfirmationModal";

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
            if (!form.playerName || !form.level) {
                toast.error("All fields are required!");
                return;
            }

            if (editId) {
                await editPlayer(editId, form);
                toast.success("Player's info updated successfully!");
            } else {
                await addPlayer(form);
                toast.success("Player added successfully!");
            }
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save player:", err);
            toast.error(err.response?.data?.message || "Failed to save player");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await removePlayer(deleteId);
            toast.success("Xóa người chơi thành công!");
            setShowConfirm(false);
        } catch (err) {
            console.error("Failed to delete player:", err);
            toast.error(
                err.response?.data?.message ||
                    "Có lỗi xảy ra khi xóa người chơi"
            );
        }
    };

    if (loading) {
        return <p>Loading...</p>;
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
