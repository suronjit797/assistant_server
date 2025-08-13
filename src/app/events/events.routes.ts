import { generateCrudRoutes, partialFilterMiddlewares } from "express-easy-curd";
import redis from "../../config/redis";
import { disabledMiddleware, setUserToBody } from "../../middleware/globalMiddleware";
import { validatorMiddleware } from "../../middleware/zodValidator";
import EventModal from "./events.model";
import { eventCreateValidate, eventUpdateValidate } from "./events.validation";

const partialFilters = ["title", "description", "category"];

const eventsRouter = generateCrudRoutes({
  mongooseModel: EventModal,
  name: "Event",
  ioredis: redis,
  cachedTime: 600,
  middlewares: {
    getAll: [partialFilterMiddlewares(partialFilters)],
    create: [validatorMiddleware(eventCreateValidate), setUserToBody],
    update: [validatorMiddleware(eventUpdateValidate), setUserToBody],
    removeMany: [disabledMiddleware],
    updateMany: [disabledMiddleware],
  },
});

export default eventsRouter;
