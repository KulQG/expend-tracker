import { Router } from "express";
import { ExpendituresRepository } from "./expenditures.repository";
import { ExpendituresService } from "./expenditures.service";
import { ExpendituresController } from "./expenditures.controller";
import { sseServiceInstance } from "../../services/sse.service";
import { prisma } from "../../db/prisma";
import { validate } from "../../middlewares/validate.middleware";
import {
  createExpenditureSchema,
  deleteExpenditureSchema,
  getExpendituresSchema,
} from "./expenditures.schema";

const router: Router = Router();

const expendituresRepository = new ExpendituresRepository(prisma);
const expendituresService = new ExpendituresService(expendituresRepository);
const expendituresController = new ExpendituresController(
  expendituresService,
  sseServiceInstance,
  sseServiceInstance
);

router.get("/sse", expendituresController.subscribeSSE);
router.get("/", validate(getExpendituresSchema), expendituresController.getAll);
router.post("/", validate(createExpenditureSchema), expendituresController.create);
router.delete("/:id", validate(deleteExpenditureSchema), expendituresController.delete);

export { router as expendituresRouter };