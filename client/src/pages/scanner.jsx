import React from "react";
import { QRCodeSVG } from "qrcode.react";

function ScanQR() {
    return (
        <div style={{ padding: "30px", color: "#00ff99", background: "#23272A", height: "100vh" }}>
            <h2>Login QR Code</h2>
            <p>Scan this QR code to open the login page</p>
            <div style={{ padding: "16px", background: "#fff", display: "inline-block" }}>
                <QRCodeSVG value="http://localhost:3000/" size={256} />
            </div>
        </div>
    );
}
export default ScanQR