import { Request, Response } from "express";
import db from "../database/connection";

export default class ConnectionsController {
  async create(request: Request, response: Response) {
    const { user_id } = request.body;

    const userExists = await db('users')
      .where('users.id', '=', user_id )

    if (userExists.length < 1) {
      return response.status(404).json({error: 'User not exists.'});
    }

    await db('connections').insert({
      user_id
    });

    return response.status(201).json({message: 'Connections successfully created.'})
  }

  async index(request: Request, response: Response) {
    const totalConnections = await db('connections').count('* as total');

    const { total } = totalConnections[0];

    return response.json({ total });
  }
}