export const generateQR = async (linkText) => {
  const qrlink = `<div class = "qr-code-bg"><img src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${linkText}" class = "qr-code" alt = "QR Code"></div>`;
  return qrlink;
};