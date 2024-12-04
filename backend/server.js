const express = require("express");
const dotenv = require('dotenv');
const { db } = require("./database/database");
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth.routes");
const { reviewRouter } = require("./routes/review.routes");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true 
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
    db.connect()
        .then(() => {
            console.log('Database connected!');
        })
        .catch((err) => {
            console.error('Connection error', err.message);
        });
});