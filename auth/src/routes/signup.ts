import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "../../../common/src/index";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email in use");
      }

      const user = User.build({ email, password });
      await user.save();

      const userJwt = jwt.sign(
        {
          email: user.email,
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
