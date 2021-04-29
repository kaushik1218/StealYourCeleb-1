const mongoose = require("mongoose");
const { bidWinner } = require("./../controllers/auctionController");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((con) => {
      // Handle Unhandled Promise rejections
      setInterval(() => {
        bidWinner();
      }, 60000);
      console.log(
        `MongoDB Database connected with HOST: ${con.connection.host}`
      );
    });
};

module.exports = connectDatabase;
