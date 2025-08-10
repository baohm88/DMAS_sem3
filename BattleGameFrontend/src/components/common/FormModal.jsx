import React from "react";
import { Modal, Button } from "react-bootstrap";

const FormModal = ({
    show,
    onHide,
    title,
    children,
    onSave,
    saveText = "Save",
    cancelText = "Cancel",
    size = "lg",
}) => {
    return (
        <Modal show={show} onHide={onHide} size={size}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {cancelText}
                </Button>
                <Button variant="primary" onClick={onSave}>
                    {saveText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FormModal;
