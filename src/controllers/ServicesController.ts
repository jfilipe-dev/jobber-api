import {Request, Response} from 'express';
import db from '../database/connection';

interface SkillItem {
  skill: string,
  level: string,
  user_id: number
}

export default class ServicesController {
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      portifolio,
      service,
      cost,
      skills
    } = request.body;
  
    const trx = await db.transaction();
  
    try {
      const insertedUsersId = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
        portifolio
      });
    
      const user_id = insertedUsersId[0];
    
      await trx('services').insert({
        service,
        cost,
        user_id
      })
    
      const newSkills = skills.map((skill: SkillItem) => ({
        ...skill,
        user_id
      }));
    
      await trx('skills').insert(newSkills);
    
      await trx.commit();
    
      return response.status(201).json({message: 'Registration successfully created.'});
    } catch (err) {
      await trx.rollback();
  
      return response.status(400).json({
        error: 'Unexpected error while creating new class',
      })
    }
  }
}