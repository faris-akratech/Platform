import express from "express";
import * as userController from "./controller.user.js";
import { verifyToken } from "./middlewares/verifyToken.js";
const router = express.Router();

router.get('/', verifyToken, userController.getAllUsers)
router.get("/test", (req, res) => {
  return res.status(200).json({ message: "User server works" });
});

export default router;
