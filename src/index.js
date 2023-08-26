import express from "express";
import envHandler from "./helpers/envHandler";
import login from "./routes/login";
import verifyuser from "./routes/verifyuser";
import userinfo from "./routes/userinfo";
import slotinfo from "./routes/slotinfo";

const app = express();
const port = envHandler('PORT');

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use("/login", login);
app.use("/verify-user", verifyuser);
app.use("/user-info", userinfo);
app.use("/slot-info", slotinfo);