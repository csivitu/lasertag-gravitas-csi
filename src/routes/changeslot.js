import express from "express";

const changeslot = express.Router();

changeslot.post("/", ChangeSlotController);

export default changeslot;
