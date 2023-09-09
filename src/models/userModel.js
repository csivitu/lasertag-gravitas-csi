import mongoose from "mongoose";
import Slot from "./slotModel.js";

const userSchema = new mongoose.Schema({
    regno: {type: String, required: true},
    phoneno: {type: String, default: null},
    email: {type: String, required: true, unique: true},
    slotBooked: {type: mongoose.Schema.Types.ObjectId, ref: 'Slot', default: null},
    scope: {type: String, default: "USER"},
});

const User = mongoose.model('User', userSchema);

export default User;