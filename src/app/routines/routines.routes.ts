import express from "express";
import { routineCreateValidate, routineUpdateValidate } from "./routines.validation";
import { partialFilterMiddlewares, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import todosController from "./routines.controller";

const todoRouter = express.Router();

todoRouter.post("/", validatorMiddleware(routineCreateValidate), setUserToBody, todosController.create);

todoRouter.get("/", partialFilterMiddlewares(["title", "description", "priority"]), todosController.getAll);
todoRouter.get("/:id", todosController.getSingle);
todoRouter.put("/:id", validatorMiddleware(routineUpdateValidate), todosController.update);
todoRouter.delete("/:id", todosController.remove);
todoRouter.post("/delete-many", todosController.removeMany);

export default todoRouter;
