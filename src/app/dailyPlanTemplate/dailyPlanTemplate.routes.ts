import { generateCrudRoutes, partialFilterMiddlewares, notFoundMiddleware } from "xmcrud";
import DailyPlanTemplateModel from "./dailyPlanTemplate.model";
import { Router } from "express";
import { validatorMiddleware } from "../../middleware/zodValidator";
import { dailyPlanTemplateCreateZodSchema, dailyPlanTemplateUpdateZodSchema } from "./dailyPlanTemplate.validation";

const partialFilterItems = [""]; // only key from model (type: string)

const dailyPlanTemplateRouter = Router();

const curdRouter = generateCrudRoutes({
  mongooseModel: DailyPlanTemplateModel,
  name: "daily-plan-template", //! name same as route name
  // ioredis: redis,  // optional if has redis in app
  middlewares: {
    getAll: [partialFilterMiddlewares(partialFilterItems)],
    create: [validatorMiddleware(dailyPlanTemplateCreateZodSchema)],
    update: [validatorMiddleware(dailyPlanTemplateUpdateZodSchema)],
    // getSingle: [],
    // remove: [],
    updateMany: [notFoundMiddleware],
    removeMany: [notFoundMiddleware],
  },
});

// Other custom routes

// dailyPlanTemplateRouter.get('/test', async (req, res) => {
//   const data = await DailyPlanTemplateModel.find()
//   res.send(data)
// })

// must be end of router
dailyPlanTemplateRouter.use(curdRouter);

export default dailyPlanTemplateRouter;
