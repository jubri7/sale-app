import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "../../../common/src/index";
import { User } from "../models/User";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError("Invalid credentials");
      }
      const passwordMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!passwordMatch) {
        throw new BadRequestError("Invalid credentials 2");
      }
      const userJwt = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser._id,
        },
        process.env.JWT_KEY!
      );

      req.session = {
        jwt: userJwt,
      };
      res.status(201).send(existingUser);
    } catch (error) {
      next(error);
    }
  }
);

export { router as signinRouter };
