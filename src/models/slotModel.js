import mongoose from "mongoose";
import User from "./userModel.js";

const slotSchema = new mongoose.Schema({
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    day: {type: Number, default: 0},
    isCarry: {type: Boolean, default: false},
    slotBookedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null}],
});

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;