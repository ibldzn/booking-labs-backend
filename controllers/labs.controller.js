const { StatusCodes } = require("http-status-codes");
const Lab = require("../models/lab.model.js");

const getAllLabs = async (req, res) => {
  try {
    const labs = await Lab.find();
    if (labs.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "No labs found" });
    }

    return res.status(StatusCodes.OK).json(labs);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const getLabById = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Lab not found" });
    }

    return res.status(StatusCodes.OK).json(lab);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const createLab = async (req, res) => {
  try {
    const lab = await Lab.create(req.body);
    return res.status(StatusCodes.CREATED).json(lab);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

const updateLab = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Lab not found" });
    }
    await lab.updateOne(req.body);

    return res.status(StatusCodes.OK).json(lab);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

const deleteLab = async (req, res) => {
  try {
    const lab = Lab.findById(req.params.id);
    if (!lab) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Lab not found" });
    }
    await lab.deleteOne();

    return res.status(StatusCodes.OK).json({ message: "Lab deleted" });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

module.exports = {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
};
