import { Request, Response } from "express";
import db from "../database/connection";

export default class ConnectionsController {
  async index(request: Request, response: Response) {
    const {service_id} = request.params;

    const skills = await db('skills')
      .where('skills.service_id', '=', service_id)
      .select(['skills.*'])

    return response.json({ skills });
  }
}