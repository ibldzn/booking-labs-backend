const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://192.168.1.10:8080",
  "http://192.168.1.10:8081",
];

const corsOptions = {
  origin: (origin, next) => {
    const isAllowed = !origin || allowedOrigins.includes(origin);
    next(null, isAllowed);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
