import express from 'express';

import ServicesController from './controllers/ServicesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router();

// Controllers
const servicesController = new ServicesController();
const connectionsController = new ConnectionsController();

// Services Routes
routes.post('/services', servicesController.create);
routes.get('/services', servicesController.index);

// Connections Routes
routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

export default routes;