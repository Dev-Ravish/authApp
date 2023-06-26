const express = require ("express");
require("dotenv").config();
const user = require("./routes/auth")
const dbConnect = require("./config/database");


const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use("/api/v1",user);


app.listen(PORT, ()=>{
    console.log(`App is listening to Port ${PORT}`);
});
dbConnect();