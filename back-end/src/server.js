const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes');
const bodyParser = require("body-parser");
const cors = require('cors');

dotenv.config()

const app = express()
const port = process.env.PORT || 9999
const host = process.env.HOST
app.use(cors());

app.use(bodyParser.json())

routes(app);
//middleware
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errorResponse = { status: statusCode, message };

    // Xử lý lỗi validation của Mongoose
    if (err.name === "ValidationError") {
        statusCode = 400;
        errorResponse = {
            status: statusCode,
            errorType: "Validation Error",
            errors: Object.keys(err.errors).map(field => ({
                field,
                message: err.errors[field].message
            }))
        };
    }

    // Xử lý lỗi ObjectId không hợp lệ của Mongoose
    if (err.name === "CastError") {
        statusCode = 400;
        errorResponse = {
            status: "ERROR",
            message: `Invalid ${err.path}: ${err.value}`
        };
    }

    return res.status(statusCode).json(errorResponse);
});



mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect DB success!')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})