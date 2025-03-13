import { DataSource, DataSourceOptions } from 'typeorm';

export const options: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: +process.env.DATABASE_PORT,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};
export default new DataSource(options);
