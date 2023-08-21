import express from "express";

const bookslot = express.Router();

bookslot.post("/", BookSlotController);

export default bookslot;