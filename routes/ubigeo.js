const express = require("express");
const router = express.Router();
const ubigeoController = require("../controllers/ubigeoController");

router.get("/departments", ubigeoController.getDepartments);
router.get("/provinces", ubigeoController.getProvincesByDepartment);
router.get("/districts", ubigeoController.getDistricts);
router.get("/:iddist", ubigeoController.getUbigeoByIddist);

module.exports = router;
