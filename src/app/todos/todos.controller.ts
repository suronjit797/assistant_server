import globalController from "../../global/global.controller";
import { TodosModel } from "./todos.model";

// variables
const name = "Todos";
// global
const globalControllers = globalController(TodosModel, name);

export default { ...globalControllers };
