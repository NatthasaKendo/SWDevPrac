const mongoose = require("mongoose");

const InterviewSessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    require: true,
    min: ["2022-05-10", "Date must be between 2022-05-10 and 2022-05-13"],
    max: ["2022-05-14", "Date must be between 2022-05-10 and 2022-05-13"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: true,
  },
});

module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);

InterviewSessionSchema.index({ date: 1, company: 1 }, { unique: true });
