import express from "express";
import { routineCreateValidate, routineUpdateValidate } from "./routines.validation";
import { partialFilterMiddlewares, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import todosController from "./routines.controller";

const routineRouter = express.Router();

routineRouter.post("/", validatorMiddleware(routineCreateValidate), setUserToBody, todosController.create);

routineRouter.get("/", partialFilterMiddlewares(["title", "description", "priority"]), todosController.getAll);
routineRouter.get("/:id", todosController.getSingle);
routineRouter.put("/:id", validatorMiddleware(routineUpdateValidate), todosController.update);
routineRouter.delete("/:id", todosController.remove);
routineRouter.post("/delete-many", todosController.removeMany);

export default routineRouter;
