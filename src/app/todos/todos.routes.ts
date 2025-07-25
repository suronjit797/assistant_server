import express from "express";
import { todoCreateValidate, todoUpdateValidate } from "./todos.validation";
// import { auth } from "../../../middleware/auth";
import { partialFilterMiddlewares, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import todosController from "./todos.controller";

const todoRouter = express.Router();

todoRouter.post("/", validatorMiddleware(todoCreateValidate), setUserToBody, todosController.create);

todoRouter.get("/", partialFilterMiddlewares(["title", "description", "priority"]), todosController.getAll);
todoRouter.get("/:id", todosController.getSingle);
todoRouter.put("/:id", validatorMiddleware(todoUpdateValidate), todosController.update);
todoRouter.delete("/:id", todosController.remove);
todoRouter.post("/delete-many", todosController.removeMany);

export default todoRouter;
