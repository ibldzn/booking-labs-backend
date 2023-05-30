const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
    default: [],
  },
});

labSchema.methods.isReservable = async function (start_time, end_time) {
  const Reservation = require("./reservation.model");
  const labId = this._id;
  const reservations = await Reservation.find({
    $and: [
      { lab_id: labId },
      {
        $or: [
          {
            $and: [
              { start_time: { $lte: start_time } },
              { end_time: { $gte: start_time } },
            ],
          },
          {
            $and: [
              { start_time: { $lte: end_time } },
              { end_time: { $gte: end_time } },
            ],
          },
          {
            $and: [
              { start_time: { $gte: start_time } },
              { end_time: { $lte: end_time } },
            ],
          },
        ],
      },
    ],
  });
  return reservations?.length === 0;
};

const Lab = mongoose.model("Lab", labSchema);

module.exports = Lab;
