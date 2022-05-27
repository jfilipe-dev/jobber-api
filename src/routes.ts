import express from "express";

import ConnectionsController from "./controllers/ConnectionsController";
import ServicesController from "./controllers/ServicesController";
import SkillsController from "./controllers/SkillsController";

const routes = express.Router();

const servicesController = new ServicesController();
const connectionsController = new ConnectionsController();
const skillsController = new SkillsController();

routes.get("/services", servicesController.index);
routes.post("/services", servicesController.create);

routes.get("/connections/:whatsapp", connectionsController.index);
routes.post("/connections", connectionsController.create);

routes.get("/skills/:service_id", skillsController.index);

export default routes;
