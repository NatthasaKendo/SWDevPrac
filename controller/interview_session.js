const InterviewSession = require("../model/Interview_session");

const Company = require("../model/Company");

//@desc     add an interview session
//@route    POST /api/v1/sessions
//@access   private
exports.addInterviewSession = async (req, res, next) => {
  try {
    //* add user id to the request body
    req.body.user = req.user.id;

    //* check for existed appointment
    const existedInterviewSession = await InterviewSession.find({
      user: req.user.id,
    });

    //* if user is not an admin, they can only create 3 appointments
    if (existedInterviewSession.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        error: `The user with ID ${req.user.id} has already created 3 interview sessions.`,
      });
    }

    const company = await Company.findById(req.body.company);

    if (!company) {
      return res.status(400).json({
        success: false,
        message: `No company with the id ${req.body.company}`,
      });
    }

    const interviewSession = await InterviewSession.create(req.body);

    res.status(200).json({
      success: true,
      data: interviewSession,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot create an interview session",
    });
  }
};

//@desc     Get an interview session
//@route    GET /api/v1/sessions/:id
//@access   public
exports.getInterviewSession = async (req, res, next) => {
  try {
    const interviewSession = await InterviewSession.findById(
      req.params.id
    ).populate({
      path: "company",
      select: "name address description telephoneNumber",
    });

    if (!interviewSession) {
      return res.status(400).json({
        success: false,
        message: `No interview session with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: interviewSession,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot find the interview session",
    });
  }
};

//@desc     Get all interview sessions
//@route    GET /api/v1/appointments
//@access   public
exports.getInterviewSessions = async (req, res, next) => {
  let query;

  //* General users can see only their appointments!
  if (req.user.role !== "admin") {
    query = InterviewSession.find({ user: req.user.id }).populate({
      path: "company",
      select: "name address description telephoneNumber",
    });
  } else {
    //* If you are an admin, you can see all!
    if (req.params.companyId) {
      query = InterviewSession.find({
        company: req.params.companyId,
      }).populate({
        path: "company",
        select: "name address description telephoneNumber",
      });
    } else {
      query = InterviewSession.find().populate({
        path: "company",
        select: "name address description telephoneNumber",
      });
    }
  }
  try {
    const sessions = await query;
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot find the interview session",
    });
  }
};

//@desc     Update an interview session
//@route    PUT /api/v1/sessions/:id
//@access   Private
exports.updateInterviewSession = async (req, res, next) => {
  try {
    let interviewSession = await InterviewSession.findById(req.params.id);

    if (
      interviewSession.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this interview session`,
      });
    }

    if (!interviewSession) {
      return res.status(404).json({
        success: false,
        message: `No an interview session with the id of ${req.params.id}`,
      });
    }

    interviewSession = await InterviewSession.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "company",
      select: "name address description telephoneNumber",
    });

    res.status(200).json({
      success: true,
      data: interviewSession,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot update the interview session",
    });
  }
};

//@desc     Delete an interview session
//@route    DELETE /api/v1/sessions/:id
//@access   Private
exports.deleteInterviewSession = async (req, res, next) => {
  try {
    const interviewSession = await InterviewSession.findById(req.params.id);
    //* Make sure the user is the one who created the appointment
    if (
      interviewSession.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this interview session`,
      });
    }
    if (!interviewSession) {
      return res.status(404).json({
        success: false,
        message: `No interview session with the id of ${req.params.id}`,
      });
    }

    await interviewSession.remove();

    res.status(200).json({
      success: true,
      message: "Interview session deleted",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot delete the interview session",
    });
  }
};
