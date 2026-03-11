import { body } from "express-validator";

export const serviceValidtor = [
  body("name")
    .notEmpty()
    .withMessage("Service name is required")
    .isLength({ min: 3 })
    .withMessage("Service name must be at least 3 characters long"),
];
