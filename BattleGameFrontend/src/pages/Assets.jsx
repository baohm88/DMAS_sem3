import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useAssets } from "../hooks/useAssets.js";
import { toast } from "react-toastify";
import AssetsTable from "../components/assets/AssetsTable";
import FormModal from "../components/common/FormModal";
import AssetForm from "../components/assets/AssetForm";
import ConfirmationModal from "../components/common/ConfirmationModal";
import FullPageSpinner from "../components/common/Spinner.jsx";

const AssetsPage = () => {
    const { assets, loading, addAsset, editAsset, removeAsset } = useAssets();

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

    if (loading) {
        return <FullPageSpinner />;
    }

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
