const connectDB = async () => {
  const mongoose = require("mongoose");
  const url = process.env.MONGO_CONNECTION_STRING;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // for mongoose 6.x
    // useFindAndModify: false, // for mongoose 6.x
  };

  try {
    await mongoose.connect(url, options);
    console.log("[server]: connected to MongoDB ::: ", url);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  const mongoose = require("mongoose");

  try {
    await mongoose.disconnect();
    console.log("[server]: disconnected from MongoDB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
