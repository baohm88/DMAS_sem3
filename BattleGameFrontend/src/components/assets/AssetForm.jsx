import { Form } from "react-bootstrap";

const AssetForm = ({
    assetName,
    levelRequired,
    onNameChange,
    onLevelChange,
}) => {
    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Asset Name</Form.Label>
                <Form.Control
                    type="text"
                    value={assetName}
                    onChange={onNameChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Level Required</Form.Label>
                <Form.Control
                    type="number"
                    value={levelRequired}
                    onChange={onLevelChange}
                />
            </Form.Group>
        </Form>
    );
};

export default AssetForm;
