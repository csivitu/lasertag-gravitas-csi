import mongoose from "mongoose";
import envHandler from "../helpers/envHandler.js";
import Slot from "./slotModel.js";

const userSchema = new mongoose.Schema({
    regno: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    slotBooked: {type: mongoose.Schema.Types.ObjectId, ref: 'Slot', default: null},
    otp: {type: Number, default: envHandler('OTP')},
    scope: {type: String, default: "USER"}
});

const User = mongoose.model('User', userSchema);

export default User;