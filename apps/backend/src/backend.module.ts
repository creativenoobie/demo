import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { UtilsModule } from '@app/utils';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { ThoughtsModule } from './thoughts/thoughts.module';
import { Reply, Thought } from './thoughts/entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().empty('').default(3000),
        DATABASE_URL: Joi.alternatives([
          Joi.string().ip({ cidr: 'forbidden' }),
          Joi.string().hostname(),
        ])
          .empty('')
          .default('localhost'),
        DATABASE_PORT: Joi.number().empty('').default(3306),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASS: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PREFIX: Joi.string().empty('').default('nm_'),
        REDIS_HOST: Joi.alternatives([
          Joi.string().ip({ cidr: 'forbidden' }),
          Joi.string().hostname(),
        ])
          .empty('')
          .default('localhost'),
        REDIS_PORT: Joi.number().empty('').default(6379),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [User, Thought, Reply],
      entityPrefix: process.env.DATABASE_PREFIX,
      synchronize: true,
      logging: true,
    }),
    RedisModule.forRoot(
      {
        config: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD ?? undefined,
          keyPrefix: 'nm_',
        },
      },
      true
    ),
    UtilsModule,
    UsersModule,
    ThoughtsModule,
  ],
})
export class BackendModule {}
