const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    website: {
      type: String,
      require: [true, "Please add a website"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    telephoneNumber: {
      type: String,
      required: [true, "Please add a telephone number"],
      match: [
        /[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
        "Please add a valid telephone number (format: 000-000-0000)",
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//* Reverse populate with virtuals
CompanySchema.virtual("interviewSessions", {
  ref: "InterviewSession",
  localField: "_id",
  foreignField: "company",
  justOne: false,
});

//* Cascade delete InterviewSession when a hospital is deleted
CompanySchema.pre("remove", async function (next) {
  console.log(`InterviewSession being removed from company ${this._id}`);
  await this.model("InterviewSession").deleteMany({ company: this._id });
  next();
});

module.exports = mongoose.model("Company", CompanySchema);
