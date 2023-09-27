const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createServer } = require("http");


// Importing Modules  

const connectDB = require("./config/db.js");




dotenv.config();
connectDB();
const app = express();
const httpServer = createServer(app);


// Cor's Option

const corsOptions = {
    origin: "*",
    "Access-Controll-Allow-Origin": "*",
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API's Are Running");
});

app.use("/api/users", require("./routes/userRoute.js"));
app.use("/api/deposit", require("./routes/depositRoute.js"));
app.use("/api/withdraw", require("./routes/withdrawRoute.js"));


const PORT = process.env.PORT || 8000;

httpServer.listen(
    PORT,
    console.log(`Server is Running on ${process.env.NODE_ENV} at port ${PORT}`)
);
