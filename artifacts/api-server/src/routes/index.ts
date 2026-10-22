import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientIntakeRouter from "./patient-intake";

const router: IRouter = Router();

router.use(healthRouter);
router.use(patientIntakeRouter);

export default router;
