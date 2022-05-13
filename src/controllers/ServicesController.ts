import { Request, Response } from 'express';
import db from '../database/connection';
import transformInScale from '../utils/transformInScale';

interface SkillItem {
  skill: string;
  level: string;
  user_id: number;
}

export default class ServicesController {
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      password,
      bio,
      portifolio,
      service,
      cost,
      skills,
    } = request.body;

    const trx = await db.transaction();

    try {
      const existingWithSameWhatsapp = await trx('users')
        .count('* as total')
        .where('whatsapp', '=', whatsapp);
      if (existingWithSameWhatsapp[0].total > 0) {
        throw new Error('Whatsapp already registered');
      }

      const insertedUsersId = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        password,
        bio,
        portifolio,
      });

      const user_id = insertedUsersId[0];

      const insertedServiceId = await trx('services').insert({
        service,
        cost,
        user_id,
      });

      const service_id = insertedServiceId[0];

      const newSkills = skills.map((skill: SkillItem) => ({
        ...skill,
        service_id,
      }));

      await trx('skills').insert(newSkills);

      await trx.commit();

      return response
        .status(201)
        .json({ message: 'Registration successfully created.' });
    } catch (err: any) {
      await trx.rollback();

      const message =
        err.message || 'Unexpected error while creating new class';

      return response.status(400).json({
        error: message,
      });
    }
  }

  async index(request: Request, response: Response) {
    const { service, cost } = request.query;

    if (!service && !cost) {
      const services = await db('services')
        .join('users', 'services.user_id', '=', 'users.id')
        .select(['services.*', 'users.*']);

      response.json(services);
    }

    if (service && cost) {
      const { min, max } = transformInScale(String(cost));

      const services = await db('services')
        .whereExists(function () {
          if (min == 0 && max == 20) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)])
              .whereRaw('`services`.`cost` <= ??', [Number(max)]);
          }
          if (min == 20 && max == 50) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)])
              .whereRaw('`services`.`cost` <= ??', [Number(max)]);
          }
          if (min == 50 && max == 100) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)])
              .whereRaw('`services`.`cost` <= ??', [Number(max)]);
          }
          if (min == 100) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)]);
          }
        })
        .where('services.service', '=', service as String)
        .join('users', 'services.user_id', '=', 'users.id')
        .select(['services.*', 'users.*']);

      return response.json(services);
    }

    if (service && !cost) {
      const services = await db('services')
        .where('services.service', '=', service as String)
        .join('users', 'services.user_id', '=', 'users.id')
        .select(['services.*', 'users.*']);

      return response.json(services);
    }

    if (!service && cost) {
      const { min, max } = transformInScale(String(cost));

      const services = await db('services')
        .whereExists(function () {
          if (min == 0 && max == 20) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)])
              .whereRaw('`services`.`cost` <= ??', [Number(max)]);
          }
          if (min == 20 && max == 50) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)])
              .whereRaw('`services`.`cost` <= ??', [Number(max)]);
          }
          if (min == 50 && max == 100) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)])
              .whereRaw('`services`.`cost` <= ??', [Number(max)]);
          }
          if (min == 100) {
            this.select('services.*')
              .from('services')
              .whereRaw('`services`.`user_id` = `users`.`id`')
              .whereRaw('`services`.`cost` > ??', [Number(min)]);
          }
        })
        .join('users', 'services.user_id', '=', 'users.id')
        .select(['services.*', 'users.*']);

      return response.json(services);
    }
  }
}
