import React from "react";
import { Form } from "react-bootstrap";

const AssetMultiSelect = ({ assets, selectedIds, playerLevel, onChange }) => {
    const handleSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) =>
            parseInt(option.value)
        );
        onChange(selected);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Assets</Form.Label>
            <Form.Select multiple value={selectedIds} onChange={handleSelect}>
                {assets.map((a) => {
                    const alreadyHas = selectedIds.includes(a.assetId);
                    const disabled =
                        !alreadyHas && playerLevel < a.levelRequired;
                    return (
                        <option
                            key={a.assetId}
                            value={a.assetId}
                            disabled={disabled}
                        >
                            {a.assetName} (Requires Lv {a.levelRequired})
                        </option>
                    );
                })}
            </Form.Select>
            <Form.Text className="text-muted">
                Assets disabled mean player level is not high enough to acquire
                them.
            </Form.Text>
        </Form.Group>
    );
};

export default AssetMultiSelect;
