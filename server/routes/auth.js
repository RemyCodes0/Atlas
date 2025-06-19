const express = require("express")
const router = express.Router()
const {registerUser, loginUser}= require("../controllers/authController");
const protect = require("../middleware/authMiddleware")
const roleAuth = require("../middleware/roleMiddleware")
const {updateUser, listUsers} = require('../controllers/userController')

router.post("/register", registerUser);
router.post("/login", loginUser);



router.get("/listUsers", listUsers)
router.put("/updateUser/:id", updateUser)

router.get("/profile", protect, roleAuth("CEO", "President"), (req, res) => {
  res.json({ msg: `Welcome user ${req.user}, this route is protected!` });
});

module.exports = router;
