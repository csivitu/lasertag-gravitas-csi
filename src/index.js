import express from "express";
import dotenv from "dotenv";
import protect from "./middleware/protect";
import login from "./routes/login";
import verifyuser from "./routes/verifyuser";
import userinfo from "./routes/userinfo";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use("/login", login);
app.use("/verify-user", verifyuser);
app.use("/user-info", protect, userinfo);