const express = require("express")
const router = express.Router()
const {registerUser, loginUser}= require("../controllers/authController");
const protect = require("../middleware/authMiddleware")
const roleAuth = require("../middleware/roleMiddleware")
const authMiddleware = require("../middleware/authMiddleware")
const {updateUser, listUsers, fireUser} = require('../controllers/userController')

router.post("/register", registerUser);
router.post("/login", loginUser);



router.get("/listUsers", listUsers)
router.put("/updateUser/:id", updateUser)

router.delete("/users/:id", authMiddleware, fireUser)

router.get("/profile", protect, roleAuth("CEO", "President"), (req, res) => {
  res.json({ msg: `Welcome user ${req.user}, this route is protected!` });
});

module.exports = router;
