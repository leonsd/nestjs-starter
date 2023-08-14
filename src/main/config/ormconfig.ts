import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const baseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/infra/entities/typeorm/*.entity.{ts,js}'],
  migrations: ['src/config/migrations/*.{ts,js}'],
};

const configs = {
  test: {
    ...baseConfig,
    synchronize: true,
    type: 'sqlite',
  },
  dev: baseConfig,
  qa: baseConfig,
  prod: baseConfig,
};

const env = process.env.NODE_ENV;
const ormconfig = configs[env];

export { ormconfig };
export default new DataSource(ormconfig);
