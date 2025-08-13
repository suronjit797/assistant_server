import express from "express";
import userRouter from "./user/user.routes";
import { uploadCloudinary } from "../utils/uploadToCloudinary";
import transactionRouter from "./transactions/transactions.routes";
import { auth } from "../middleware/auth";
import todoRouter from "./todos/todos.routes";
import routineRouter from "./routines/routines.routes";
import pmRouter from "./passwordManager/passwordManager.routes";
import diaryRouter from "./diary/diary.routes";
import blogRouter from "./blog/blog.routes";
import contactRouter from "./contacts/contacts.routes";
import eventsRouter from "./events/events.routes";

const router = express.Router();

const moduleRoute = [
  { path: "/users", routes: userRouter, auth: false },
  { path: "/transactions", routes: transactionRouter, auth: true },
  { path: "/todos", routes: todoRouter, auth: true },
  { path: "/routines", routes: routineRouter, auth: true },
  { path: "/password-manager", routes: pmRouter, auth: true },
  { path: "/diary", routes: diaryRouter, auth: true },
  { path: "/blog", routes: blogRouter, auth: true },
  { path: "/contact", routes: contactRouter, auth: true },
  { path: "/events", routes: eventsRouter, auth: true },
];

moduleRoute.forEach((route) =>
  route?.auth ? router.use(route.path, auth(), route.routes) : router.use(route.path, route.routes),
);

// image upload
router.post("/upload", uploadCloudinary.single("photo"), (req, res, next) => {
  try {
    const data = {
      uid: req.file?.filename,
      name: req.file?.filename.split("/").pop() + ".webp",
      url: req.file?.path,
      size: req.file?.size,
    };

    res.send({
      success: true,
      message: "File uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
