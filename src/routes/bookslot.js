import express from "express";

const bookslot = express.Router();

bookslot.post("/", BookslotController);

export default bookslot;