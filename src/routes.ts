import express from 'express';

import ServicesController from './controllers/ServicesController';
import ConnectionsController from './controllers/ConnectionsController';
import SkillsController from './controllers/SkillsController';

const routes = express.Router();

// Controllers
const servicesController = new ServicesController();
const connectionsController = new ConnectionsController();
const skillsController = new SkillsController();

// Services Routes
routes.post('/services', servicesController.create);
routes.get('/services', servicesController.index);

// Connections Routes
routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

routes.get('/skills/:service_id', skillsController.index);

export default routes;