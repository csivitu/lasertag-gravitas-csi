import QRCode from "qrcode";
import Logger from "../initializers/logger";

export const generateQR = async (text) => {
  try {
    const opts = {
      type: "svg",
    };

    return await QRCode.toString(text, opts);
  } catch (err) {
    Logger.error(`Encountered error in QR code generation: ${err}`);
  }
};