// src/components/common/CrudTable.jsx
import React from "react";
import { Table } from "react-bootstrap";

const CrudTable = ({ columns, data = [], renderActions }) => {
    if (!Array.isArray(data)) {
        console.log("CrudTable: data prop must be an array");
        return <p>No data available</p>;
    }
    return (
        <Table striped bordered hover className="mt-3">
            <thead>
                <tr>
                    <th>#</th>
                    {columns.map((col) => (
                        <th key={col.key}>{col.header}</th>
                    ))}
                    {renderActions && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={item.id || index}>
                        <td>{index + 1}</td>
                        {columns.map((col) => (
                            <td key={col.key}>
                                {col.render ? col.render(item) : item[col.key]}
                            </td>
                        ))}
                        {renderActions && <td>{renderActions(item)}</td>}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default CrudTable;
