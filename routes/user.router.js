import { Router } from "express";
import { User } from "../config/models/user.model.js";
import { requireJwtCookie } from "../middlewares/auth.middleware.js";

const router = new Router();


router.get("/", requireJwtCookie, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
