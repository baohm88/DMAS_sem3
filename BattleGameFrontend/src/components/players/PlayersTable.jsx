// import React from "react";
// import CrudTable from "../common/CrudTable";
// import { FaEdit } from "react-icons/fa";
// import { FaTrashCan } from "react-icons/fa6";

// const PlayersTable = ({ players, onEdit, onDelete }) => {
//     const columns = [
//         { key: "playerName", header: "Player Name" },
//         { key: "level", header: "Level" },
//         { key: "age", header: "Age" },
//         {
//             key: "assetNames",
//             header: "Assets",
//             render: (player) => player.assetNames.join(", "),
//         },
//     ];

//     const renderActions = (player) => (
//         <>
//             <button
//                 className="btn btn-warning btn-sm me-2"
//                 onClick={() => onEdit(player)}
//             >
//                 <FaEdit /> Edit
//             </button>
//             <button
//                 className="btn btn-danger btn-sm"
//                 onClick={() => onDelete(player.playerId)}
//             >
//                 <FaTrashCan /> Delete
//             </button>
//         </>
//     );

//     return (
//         <CrudTable
//             columns={columns}
//             data={players}
//             renderActions={renderActions}
//             getId={(item) => item.playerId}
//         />
//     );
// };

// export default PlayersTable;

import React from "react";
import CrudTable from "../common/CrudTable";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const PlayersTable = ({ players, onEdit, onDelete }) => {
    const columns = [
        { key: "playerName", header: "Player Name" },
        { key: "level", header: "Level" },
        { key: "age", header: "Age" },
        {
            key: "assets",
            header: "Assets",
            render: (player) => {
                // Check if assetNames don't exist or is not array
                if (!player.assetNames || !Array.isArray(player.assetNames)) {
                    return "No assets";
                }
                return player.assetNames.join(", ");
            },
        },
    ];

    const renderActions = (player) => (
        <>
            <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onEdit(player)}
            >
                <FaEdit /> Edit
            </button>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(player.playerId)}
            >
                <FaTrashCan /> Delete
            </button>
        </>
    );

    return (
        <CrudTable
            columns={columns}
            data={players}
            renderActions={renderActions}
            getId={(item) => item.playerId}
        />
    );
};

export default PlayersTable;
