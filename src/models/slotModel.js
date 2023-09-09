import mongoose from "mongoose";
import User from "./userModel.js";
import envHandler from "../helpers/envHandler.js";

const slotSchema = new mongoose.Schema({
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    day: {type: Number, default: 0},
    isCarry: {type: Boolean, default: false},
    slotBookedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null}],
});

slotSchema.virtual('availability').get(function() {
    return (envHandler('SLOTCAP') - this.slotBookedBy.length);
});

slotSchema.set('toJSON', {virtuals: true});

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;