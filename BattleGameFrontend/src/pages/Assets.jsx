// import React, { useEffect, useState } from "react";
// import { Container, Table, Button, Modal, Form } from "react-bootstrap";
// import axios from "axios";
// import { toast } from "react-toastify";

// import { FaEdit } from "react-icons/fa";
// import { FaTrashCan } from "react-icons/fa6";

// const API_URL_ASSETS = "http://localhost:5000/api/assets";

// export default function AssetsPage() {
//     const [assets, setAssets] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [assetName, setAssetName] = useState("");
//     const [levelRequired, setLevelRequired] = useState("");

//     useEffect(() => {
//         fetchAssets();
//     }, []);

//     const fetchAssets = async () => {
//         try {
//             const res = await axios.get(API_URL_ASSETS);
//             setAssets(res.data);
//         } catch {
//             toast.error("Failed to fetch assets");
//         }
//     };

//     const handleShowModal = (asset = null) => {
//         if (asset) {
//             setEditId(asset.assetId);
//             setAssetName(asset.assetName);
//             setLevelRequired(asset.levelRequired);
//         } else {
//             setEditId(null);
//             setAssetName("");
//             setLevelRequired("");
//         }
//         setShowModal(true);
//     };

//     const handleCloseModal = () => setShowModal(false);

//     const handleSave = async () => {
//         try {
//             const data = {
//                 assetName,
//                 levelRequired: parseInt(levelRequired, 10),
//             };

//             if (!data.assetName || !data.levelRequired) {
//                 toast.warning("Please enter all required fields");
//                 return;
//             }

//             if (editId) {
//                 await axios.put(`${API_URL_ASSETS}/${editId}`, data);
//                 toast.success("Asset updated");
//             } else {
//                 await axios.post(API_URL_ASSETS, data);
//                 toast.success("Asset added");
//             }
//             fetchAssets();
//             handleCloseModal();
//         } catch (err) {
//             toast.error(err.response?.data || "Failed to save asset");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (confirm("Are you sure you want to delete this asset?")) {
//             try {
//                 await axios.delete(`${API_URL_ASSETS}/${id}`);
//                 toast.success("Asset deleted");
//                 fetchAssets();
//             } catch {
//                 toast.error("Failed to delete asset");
//             }
//         }
//     };

//     return (
//         <Container className="mt-4">
//             <h1 className="mb-4">Battle Game Assets</h1>
//             <Button onClick={() => handleShowModal()}>Add Asset</Button>
//             <Table striped bordered hover className="mt-3">
//                 <thead>
//                     <tr>
//                         <th>No</th>
//                         <th>Asset Name</th>
//                         <th>Level Required</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {assets.map((a, index) => (
//                         <tr key={a.assetId}>
//                             <td>{index + 1}</td>
//                             <td>{a.assetName}</td>
//                             <td>{a.levelRequired}</td>
//                             <td>
//                                 <Button
//                                     size="sm"
//                                     variant="warning"
//                                     onClick={() => handleShowModal(a)}
//                                     className="me-2"
//                                 >
//                                     <FaEdit /> Edit
//                                 </Button>
//                                 <Button
//                                     size="sm"
//                                     variant="danger"
//                                     onClick={() => handleDelete(a.assetId)}
//                                 >
//                                     <FaTrashCan /> Delete
//                                 </Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             {/* Modal Form */}
//             <Modal show={showModal} onHide={handleCloseModal}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>
//                         {editId ? "Edit Asset" : "Add Asset"}
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Asset Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 value={assetName}
//                                 onChange={(e) => setAssetName(e.target.value)}
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Level Required</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 value={levelRequired}
//                                 onChange={(e) =>
//                                     setLevelRequired(e.target.value)
//                                 }
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseModal}>
//                         Cancel
//                     </Button>
//                     <Button variant="primary" onClick={handleSave}>
//                         Save
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// }

import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useAssets } from "../hooks/useAssets.js";
import { toast } from "react-toastify";
import AssetsTable from "../components/assets/AssetsTable";
import FormModal from "../components/common/FormModal";
import AssetForm from "../components/assets/AssetForm";
import ConfirmationModal from "../components/common/ConfirmationModal";

const AssetsPage = () => {
    const { assets, addAsset, editAsset, removeAsset } = useAssets();

    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [assetName, setAssetName] = useState("");
    const [levelRequired, setLevelRequired] = useState("");
    const [deleteId, setDeleteId] = useState(null);

    const handleShowModal = (asset = null) => {
        if (asset) {
            setEditId(asset.assetId);
            setAssetName(asset.assetName);
            setLevelRequired(asset.levelRequired.toString());
        } else {
            setEditId(null);
            setAssetName("");
            setLevelRequired("");
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSave = async () => {
        try {
            const data = {
                assetName,
                levelRequired: parseInt(levelRequired, 10),
            };

            if (!data.assetName || isNaN(data.levelRequired)) {
                toast.error("Asset name and required level are required!");
                return;
            }

            if (editId) {
                await editAsset(editId, data);
                toast.success("Asset updated successfully!");
            } else {
                await addAsset(data);
                toast.success("Asset added successfully!");
            }
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save asset:", err);
            toast.error(err.response?.data?.message || "Failed to save Asset!");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await removeAsset(deleteId);
            toast.success("Asset deleted successfully!");
            setShowConfirm(false);
        } catch (err) {
            console.error("Failed to delete asset:", err);
            toast.error(
                err.response?.data?.message || "Failed to delete Asset!"
            );
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Battle Game Assets</h1>
            <Button variant="primary" onClick={() => handleShowModal()}>
                Add Asset
            </Button>

            <AssetsTable
                assets={assets}
                onEdit={handleShowModal}
                onDelete={handleDeleteClick}
            />

            <FormModal
                show={showModal}
                onHide={handleCloseModal}
                title={editId ? "Edit Asset" : "Add Asset"}
                onSave={handleSave}
            >
                <AssetForm
                    assetName={assetName}
                    levelRequired={levelRequired}
                    onNameChange={(e) => setAssetName(e.target.value)}
                    onLevelChange={(e) => setLevelRequired(e.target.value)}
                />
            </FormModal>

            <ConfirmationModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this asset?"
            />
        </Container>
    );
};

export default AssetsPage;
