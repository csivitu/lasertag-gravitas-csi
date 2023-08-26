import express from "express";
import dotenv from "dotenv";
import login from "./routes/login";
import verifyuser from "./routes/verifyuser";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use("/login", login);
app.use("/verify-user", verifyuser);
