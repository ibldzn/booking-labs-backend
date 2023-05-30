const mongoose = require("mongoose");

const laboranSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
});

const Laboran = mongoose.model("Laboran", laboranSchema);

module.exports = Laboran;
