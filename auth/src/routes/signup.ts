import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest, upload } from "@jugitix/common";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("username")
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  upload(process.env.MONGO_URI!).single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new BadRequestError("Username in use");
      }
      if (!req.file) throw new BadRequestError("Image not uploaded");

      const user = User.build({ username, password, image: req.file });
      await user.save();

      const userJwt = jwt.sign(
        {
          email: user.username,
          id: user._id,
        },
        process.env.JWT_KEY!
      );

      req.session = {
        jwt: userJwt,
      };
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as signupRouter };
