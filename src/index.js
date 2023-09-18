import express from "express";
import envHandler from "./helpers/envHandler.js";
import connectToDB from "./initializers/DB.js";
import expressMongoSanitize from "express-mongo-sanitize";
import login from "./routes/login.js";
import verifyuser from "./routes/verifyuser.js";
import userinfo from "./routes/userinfo.js";
import slotinfo from "./routes/slotinfo.js";
import bookslot from "./routes/bookslot.js";
import changeslot from "./routes/changeslot.js";
import cancelslot from "./routes/cancelslot.js";
import adminslotinfo from "./routes/adminslotinfo.js";
import admincancelslot from "./routes/admincancelslot.js";
import adminassignslot from "./routes/adminassignslot.js";
import createuserdata from "./routes/createuserdata.js";
import createslotdata from "./routes/createslotdata.js";
import adminsetslot from "./routes/adminsetslot.js";
import adminexportslotdb from "./routes/adminexportslotdb.js";
import adminexportuserdb from "./routes/adminexportuserdb.js";
import cors from "cors";
import adminscan from "./routes/adminscan.js";
import apilimiter from "./middleware/apilimiter.js";
import changeslotlimiter from "./middleware/changeslotlimiter.js";

const app = express();
const port = envHandler('PORT');

app.use(cors());
app.use(express.json());
app.use(expressMongoSanitize());

connectToDB();

app.use(apilimiter);
app.use("/change-slot", changeslotlimiter);

app.use("/login", login);
app.use("/verify-user", verifyuser);
app.use("/user-info", userinfo);
app.use("/slot-info", slotinfo);
app.use("/book-slot", bookslot);
app.use("/change-slot", changeslot);
app.use("/cancel-slot", cancelslot);
app.use("/admin-slot-info", adminslotinfo);
app.use("/admin-cancel-slot", admincancelslot);
app.use("/admin-assign-slot", adminassignslot);
app.use("/create-user-data", createuserdata);
app.use("/admin-scan", adminscan);
app.use("/create-slot-data", createslotdata);
app.use("/admin-set-slot", adminsetslot);
app.use("/admin-export-slot-db", adminexportslotdb);
app.use("/admin-export-user-db", adminexportuserdb);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});