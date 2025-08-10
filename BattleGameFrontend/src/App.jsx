import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import PlayersPage from "./pages/Players";
import AssetsPage from "./pages/Assets";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<PlayersPage />} />
                <Route path="/assets" element={<AssetsPage />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}
