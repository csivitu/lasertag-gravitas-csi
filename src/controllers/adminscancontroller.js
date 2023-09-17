import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import User from "../models/userModel.js";

const AdminScan = catchAsync(async (req, res) => {
  const { regno } = req.params;
  const user = await User.find({ regno: regno }).populate("slotBooked");
  if (!user) {
    return res.status(400).json({ error: "Invalid User ID" });
  }
  if (user.QR.isScanned) {
    return res.status(400).json({ error: "User has already scanned QR" });
  }
  user.QR.isScanned = true;
  await user.save();

  Logger.info(`Successfully scanned QR code for user ${regno}.`);
  return res.status(200).json({ scanned: true, slot: user.slotBooked });
});

export default AdminScan;
