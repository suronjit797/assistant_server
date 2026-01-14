import { generateCrudRoutes, partialFilterMiddlewares, notFoundMiddleware } from "xmcrud";
import DailyChecklistModel from "./dailyChecklist.model";
import { Router } from "express";
import { validatorMiddleware } from "../../middleware/zodValidator";
import { dailyChecklistCreateZodSchema, dailyChecklistUpdateZodSchema } from "./dailyChecklist.validation";

const partialFilterItems = [""]; // only key from model (type: string)

const dailyChecklistRouter = Router();

const curdRouter = generateCrudRoutes({
  mongooseModel: DailyChecklistModel,
  name: "daily-checklist",
  // ioredis: redis,  // optional if has redis in app
  middlewares: {
    getAll: [partialFilterMiddlewares(partialFilterItems)],
    create: [validatorMiddleware(dailyChecklistCreateZodSchema)],
    update: [validatorMiddleware(dailyChecklistUpdateZodSchema)],
    updateMany: [notFoundMiddleware], //notFoundMiddleware for disabled access to end user
    removeMany: [notFoundMiddleware], //notFoundMiddleware for disabled access to end user
    // remove: [],
    // getSingle: [],
  },
});

// Other custom routes

// dailyChecklistRouter.get('/test', async (req, res) => {
//   const data = await DailyChecklistModel.find()
//   res.send(data)
// })

// must be end of router
dailyChecklistRouter.use(curdRouter);

export default dailyChecklistRouter;
