const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controller/company");

//Re-route into other resource routers
const sessionRouter = require("./interview_session");
router.use("/:companyId/sessions", sessionRouter);

router
  .route("/")
  .get(getCompanies)
  .post(protect, authorize("admin"), createCompany);

router
  .route("/:id")
  .get(getCompany)
  .put(protect, authorize("admin"), updateCompany)
  .delete(protect, authorize("admin"), deleteCompany);

module.exports = router;
