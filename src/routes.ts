import express from 'express';
import ServicesController from './controllers/ServicesController';

const routes = express.Router();

const servicesController = new ServicesController();

routes.post('/services', servicesController.create)

export default routes;