const { StatusCodes } = require("http-status-codes");
const Reservation = require("../models/reservation.model");
const Lab = require("../models/lab.model");
const User = require("../models/user.model");

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    if (reservations?.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No reservations found" });
    }

    return res.status(StatusCodes.OK).json(reservations);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Reservation not found" });
    }

    return res.status(StatusCodes.OK).json(reservation);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const nowSeconds = Math.floor(Date.now() / 1000);
    let { lab_id, start_time = nowSeconds, end_time } = req.body;

    if (!lab_id || !end_time) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Missing required fields" });
    }

    if (start_time < nowSeconds) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Start time must be in the future" });
    }

    if (start_time >= end_time) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Start time must be before end time" });
    }

    const lab = await Lab.findById(lab_id);
    if (!lab) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Lab not found" });
    }

    start_time = new Date(start_time * 1000);
    end_time = new Date(end_time * 1000);

    if (!(await lab.isReservable(start_time, end_time))) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Lab is already reserved for this time" });
    }

    const user = await User.findById(req.userId);
    // should never happen because of auth middleware
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const reservation = await Reservation.create({
      lab_id,
      user_id: user._id,
      klass: user.klass,
      start_time,
      end_time,
    });
    return res.status(StatusCodes.CREATED).json(reservation);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

const getActiveReservations = async (req, res) => {
  try {
    const { labId } = req.params;

    const currentTime = new Date();
    const query = Reservation.find({
      $and: [
        { start_time: { $lte: currentTime } },
        { end_time: { $gte: currentTime } },
      ],
    });

    if (labId) {
      query.where({ lab_id: labId });
    }

    const reservations = await query.exec();
    return res.status(StatusCodes.OK).json(reservations);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const getPastReservations = async (req, res) => {
  try {
    const { labId } = req.params;

    const currentTime = new Date();
    const query = Reservation.find({
      end_time: { $lt: currentTime },
    });

    if (labId) {
      query.where({ lab_id: labId });
    }

    const reservations = await query.exec();
    return res.status(StatusCodes.OK).json(reservations);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const getFutureReservations = async (req, res) => {
  try {
    const { labId } = req.params;

    const currentTime = new Date();
    const query = Reservation.find({
      start_time: { $gt: currentTime },
    });

    if (labId) {
      query.where({ lab_id: labId });
    }

    const reservations = await query.exec();
    return res.status(StatusCodes.OK).json(reservations);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Reservation not found" });
    }

    const userId = req.userId;
    const reservationUserId = reservation.user_id.toString();
    if (reservationUserId !== userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "You are not authorized to delete this reservation" });
    }

    await reservation.deleteOne();

    return res.status(StatusCodes.OK).json({ message: "Reservation deleted" });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  getActiveReservations,
  getPastReservations,
  getFutureReservations,
  deleteReservation,
};
