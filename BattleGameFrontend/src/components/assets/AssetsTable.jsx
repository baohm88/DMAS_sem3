import React from "react";
import CrudTable from "../common/CrudTable";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const AssetsTable = ({ assets = [], onEdit, onDelete }) => {
    const columns = [
        { key: "assetName", header: "Asset Name" },
        { key: "levelRequired", header: "Level Required" },
    ];

    const renderActions = (asset) => (
        <>
            <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onEdit(asset)}
            >
                <FaEdit /> Edit
            </button>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(asset.assetId)}
            >
                <FaTrashCan /> Delete
            </button>
        </>
    );

    return (
        <CrudTable
            columns={columns}
            data={assets}
            renderActions={renderActions}
            getId={(item) => item.assetId}
        />
    );
};

export default AssetsTable;
