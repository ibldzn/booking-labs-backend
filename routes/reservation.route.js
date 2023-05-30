const Router = require("express").Router();

const { isAuthenticated } = require("../middlewares/app.authentication");

const {
  getReservations,
  getReservationById,
  createReservation,
  getActiveReservations,
  getPastReservations,
  getFutureReservations,
  deleteReservation,
} = require("../controllers/reservation.controller");

Router.get("/reservations", getReservations);
Router.get("/reservations/active/:labId?", getActiveReservations);
Router.get("/reservations/past/:labId?", getPastReservations);
Router.get("/reservations/future/:labId?", getFutureReservations);
Router.get("/reservations/:id", getReservationById);
Router.post("/reservations", isAuthenticated, createReservation);
Router.delete("/reservations/:id", isAuthenticated, deleteReservation);

module.exports = Router;
