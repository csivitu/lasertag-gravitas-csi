import express from "express";
import envHandler from "./helpers/envHandler.js";
import login from "./routes/login.js";
import verifyuser from "./routes/verifyuser.js";
import userinfo from "./routes/userinfo.js";
import slotinfo from "./routes/slotinfo.js";

const app = express();
const port = envHandler('PORT');

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use("/login", login);
app.use("/verify-user", verifyuser);
app.use("/user-info", userinfo);
app.use("/slot-info", slotinfo);