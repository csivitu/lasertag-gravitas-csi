import mongoose from "mongoose";
import User from "./userModel.js";

const slotSchema = new mongoose.Schema({
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    day: {type: Number, default: 0},
    slotBookedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    venue: {type: String, required: true}
});

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;