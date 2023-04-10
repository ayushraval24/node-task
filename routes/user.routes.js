const router = require("express").Router();
const {
  registrationValidator,
  loginValidator,
} = require("../helper/validatior.helper");
const userController = require("../controllers/user.controller");
const multer = require("multer");
const isAuth = require("../helper/auth.helper");

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/profile", isAuth, userController.myProfile);
router.get("/users", isAuth, userController.getUsers);
router.post(
  "/register",
  upload.single("profile_image"),
  registrationValidator,
  userController.registration
);
router.post("/login", loginValidator, userController.login);

module.exports = router;
