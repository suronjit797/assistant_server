import express, { RequestHandler } from "express";
import { todoCreateValidate, todoUpdateValidate } from "./todos.validation";
// import { auth } from "../../../middleware/auth";
import todosController from "./todos.controller";
import { validatorMiddleware } from "../../middleware/zodValidator";
import { setUserToBody } from "./todos.middleware";

const partialFilterMiddlewares: RequestHandler = (req, res, next) => {
  req.partialFilter = ["title", "description", "priority"];
  next();
};

const todoRouter = express.Router();

todoRouter.post("/", validatorMiddleware(todoCreateValidate), setUserToBody, todosController.create);

todoRouter.get("/", partialFilterMiddlewares, todosController.getAll);
todoRouter.get("/:id", todosController.getSingle);
todoRouter.put("/:id", validatorMiddleware(todoUpdateValidate), todosController.update);
todoRouter.delete("/:id", todosController.remove);
todoRouter.post("/delete-many", todosController.removeMany);

export default todoRouter;
