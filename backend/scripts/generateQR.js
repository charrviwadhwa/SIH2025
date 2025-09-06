import QRCode from "qrcode";

// Use the qrCode returned from session creation
const qrCode = "3KXLGU";

// Generate a PNG file
QRCode.toFile(`session_${qrCode}.png`, qrCode, {
  color: {
    dark: "#000000",
    light: "#FFFFFF"
  }
})
  .then(() => console.log("QR code generated: session_" + qrCode + ".png"))
  .catch(err => console.error(err));
