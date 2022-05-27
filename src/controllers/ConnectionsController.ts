import { Request, Response } from "express";

import db from "../database/connection";

export default class ConnectionsController {
  async index(request: Request, response: Response) {
    const { whatsapp } = request.params;
    if (!whatsapp) {
      return response
        .status(400)
        .json({ error: "Param whatsapp is required." });
    }
    const userExists = await db("users").where("users.whatsapp", "=", whatsapp);
    if (userExists.length < 1) {
      return response.status(404).json({ error: "User not exists." });
    }
    const connections = await db.raw(
      "select * from connections where connections.user_id = (select id from users where whatsapp = ?)",
      whatsapp
    );
    return response.json({ connections });
  }

  async create(request: Request, response: Response) {
    const { user_id, message } = request.body;
    const userExists = await db("users").where("users.id", "=", user_id);
    if (userExists.length < 1) {
      return response.status(404).json({ error: "User not exists." });
    }
    await db("connections").insert({
      user_id,
      message,
    });
    return response
      .status(201)
      .json({ message: "Connections successfully created." });
  }
}
