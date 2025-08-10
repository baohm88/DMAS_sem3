import { Form } from "react-bootstrap";
import AssetMultiSelect from "../common/AssetMultiSelect";

const PlayerForm = ({ form, onChange, onSelectAssets, assets }) => {
    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Player Name</Form.Label>
                <Form.Control
                    type="text"
                    name="playerName"
                    value={form.playerName}
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={onChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Level</Form.Label>
                <Form.Control
                    type="number"
                    name="level"
                    value={form.level}
                    onChange={onChange}
                />
            </Form.Group>

            <AssetMultiSelect
                assets={assets}
                selectedIds={form.assetIds}
                playerLevel={parseInt(form.level || 0, 10)}
                onChange={onSelectAssets}
            />
        </Form>
    );
};

export default PlayerForm;
