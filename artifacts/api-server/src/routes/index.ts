import { Router, type IRouter } from "express";
import githubContributionsRouter from "./github-contributions";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(githubContributionsRouter);

export default router;
