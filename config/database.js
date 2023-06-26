const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () =>{
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser : true,
        useUnifiedTopology: true
    })
    .then(console.log("DB conected successfully!!"))
    .catch((error) => {
        console.log("Issue in connection to DB.");
        process.exit(1);
    });
};

module.exports = dbConnect;