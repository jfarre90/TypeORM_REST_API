import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import hero from "./hero";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/heroes", hero);

export default routes;