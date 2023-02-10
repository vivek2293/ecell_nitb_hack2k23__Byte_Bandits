const express = require("express");
const router = express.Router();

const { 
    getAllrecords,
    createStudentRecord
} = require("../functions/user.operation");

router.get("/record/alldata", getAllrecords);
router.post("/record/createData", createStudentRecord);

module.exports = router;