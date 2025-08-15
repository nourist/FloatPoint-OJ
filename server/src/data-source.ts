import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST ?? 'localhost',
	port: +process.env.DB_PORT! || 5432,
	username: process.env.DB_USER ?? 'postgres',
	password: process.env.DB_PASS ?? 'postgres',
	database: process.env.DB_NAME ?? 'postgres',
	synchronize: false,
	logging: false,
	entities: [__dirname + '/entities/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
