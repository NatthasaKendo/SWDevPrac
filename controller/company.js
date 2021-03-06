const Company = require("../model/Company");

//@desc     Get all companies
//@route    GET /api/v1/companies
//@access   Public
exports.getCompanies = async (req, res, next) => {
  let query;

  //* Copy req.query
  const reqQuery = { ...req.query };

  //* Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //* Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //* Create query string
  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|in)\b/g,
    (match) => `$${match}`
  );

  query = Company.find(JSON.parse(queryStr)).populate("interviewSessions");

  //* Select Fields
  if (req.query.select) {
    const field = req.query.select.split(",").join(" ");
    query = query.select(field);
  }

  //* Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("date");
  }

  //* Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Company.countDocuments();

  query = query.skip(startIndex).limit(limit);

  try {
    //* Execute query
    const companies = await query;

    //* Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

//@desc     Get a company
//@route    GET /api/v1/companies/:id
//@access   Public
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(400).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

//@desc     Create a company
//@route    POST /api/v1/companies
//@access   Private
exports.createCompany = async (req, res, next) => {
  const company = await Company.create(req.body);
  res.status(201).json({
    success: true,
    data: company,
  });
};

//@desc     Update a company
//@route    PUT /api/v1/companies/:id
//@access   Private
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(400).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

//@desc     Delete a company
//@route    DELETE /api/v1/companies/:id
//@access   Private
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(400).json({
        success: false,
        msg: "not found",
      });
    }

    await company.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};
