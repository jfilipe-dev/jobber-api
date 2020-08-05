import express from 'express';
import ServicesController from './controllers/ServicesController';

const routes = express.Router();

const servicesController = new ServicesController();

routes.post('/services', servicesController.create)
routes.get('/services', servicesController.index)

export default routes;