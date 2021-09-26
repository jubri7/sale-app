import { BadRequestError, requireAuth, validateRequest } from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import multer from "multer";
import { upload } from "../service/upload";
import { body } from "express-validator";
import { Item } from "../models/Item";
import { ItemCreatedPublisher } from "../events/publisher/itemCreatedPublisher";
import { natsWrapper } from "../stan";

const router = express.Router();

router.post(
  "/api/items",
  requireAuth,
  multer({ dest: "/upload" }).single("file"),
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater then 0"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price } = req.body;
      if (!req.file) throw new BadRequestError("Upload Image");
      const url = (await upload(req.file)).Location;
      console.log(url);
      if (!url) throw new BadRequestError("Something went wrong");
      const item = Item.build({
        name,
        price,
        image: url,
        userId: req.currentUser!.id,
      });
      await item.save();
      new ItemCreatedPublisher(natsWrapper.client).publish({
        id: item.id,
        image: url,
        price: item.price,
        userId: req.currentUser!.id,
        name: item.name,
      });
      res.send(item);
    } catch (error) {
      next(error);
    }
  }
);

export { router as addItemRouter };
