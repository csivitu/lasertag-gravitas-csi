import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";

const AdminScan = catchAsync(async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email: email }).populate("slotBooked");
  if (!user) {
    return res.status(400).json({ error: "Invalid User ID" });
  }
  if (user.QR.isScanned) {
    return res.status(400).json({ error: "User has already scanned QR" });
  }
  user.QR.isScanned = true;
  await user.save();

  const slot = await Slot.findById(user.slotBooked);
  if (!slot) {
    return res.status(400).json({ error: "Invalid Slot ID" });
  }

  Logger.info(`Successfully scanned QR code for user ${email}.`);
  return res.status(200).json({ scanned: true, slot: slot });
});

export default AdminScan;
