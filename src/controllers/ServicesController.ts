import {Request, Response} from 'express';
import db from '../database/connection';
import transformInScale from '../utils/transformInScale';

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

  async index(request: Request, response: Response) {
    const {service, cost} = request.query;

    if(!service || !cost) {
      return response.status(400).json({
        error: 'Missing filters to search services'
      });
    }

    const {min, max} = transformInScale(String(cost));

    const services = await db('services')
      .whereExists(function() {
        if (min == 0 && max == 20) {
          this.select('services.*')
          .from('services')
          .whereRaw('`services`.`user_id` = `users`.`id`')
          .whereRaw('`services`.`cost` > ??', [Number(min)])
          .whereRaw('`services`.`cost` <= ??', [Number(max)])
        }
        if (min == 20 && max == 50) {
          this.select('services.*')
          .from('services')
          .whereRaw('`services`.`user_id` = `users`.`id`')
          .whereRaw('`services`.`cost` > ??', [Number(min)])
          .whereRaw('`services`.`cost` <= ??', [Number(max)])
        }
        if (min == 50 && max == 100) {
          this.select('services.*')
          .from('services')
          .whereRaw('`services`.`user_id` = `users`.`id`')
          .whereRaw('`services`.`cost` > ??', [Number(min)])
          .whereRaw('`services`.`cost` <= ??', [Number(max)])
        }
        if (min == 100) {
          this.select('services.*')
          .from('services')
          .whereRaw('`services`.`user_id` = `users`.`id`')
          .whereRaw('`services`.`cost` > ??', [Number(min)])
        }
      })
      .where('services.service', '=', service as String)
      .join('users', 'services.user_id', '=', 'users.id')
      .select(['services.*', 'users.*'])

    return response.json(services);
  }
}