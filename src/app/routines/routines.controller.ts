import globalController from "../../global/global.controller";
import { RoutineModel } from "./routines.model";

// variables
const name = "Routine";
// global
const globalControllers = globalController(RoutineModel, name);

export default { ...globalControllers };
