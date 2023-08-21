import express from "express";

const cancelslot = express.Router();

cancelslot.post("/", CancelSlotController);

export default cancelslot;
