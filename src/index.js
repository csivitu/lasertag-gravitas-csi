import express from "express";
import envHandler from "./helpers/envHandler";
import protect from "./middleware/protect";
import login from "./routes/login";
import verifyuser from "./routes/verifyuser";
import userinfo from "./routes/userinfo";

const app = express();
const port = envHandler('PORT');

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use("/login", login);
app.use("/verify-user", verifyuser);
app.use("/user-info", protect, userinfo);