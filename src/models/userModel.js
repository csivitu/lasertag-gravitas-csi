import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    regno: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    isChangedSlot: {type: Boolean, default: false},
    slotBooked: {type: mongoose.Schema.Types.ObjectId, ref: 'Slot', default: null},
    otp: {type: Number, default: 7483},
    scope: {type: String, default: "USER"}
});

const User = mongoose.model('User', userSchema);

export default User;