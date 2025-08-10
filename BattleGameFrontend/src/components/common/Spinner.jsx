import { Spinner } from "react-bootstrap";

export default function FullPageSpinner() {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 9999,
            }}
        >
            <Spinner
                animation="border"
                variant="primary"
                style={{ width: "4rem", height: "4rem" }}
            />
        </div>
    );
}
