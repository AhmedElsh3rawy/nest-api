import { FactoryProvider, Logger } from "@nestjs/common";
import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { DefaultLogger, LogWriter } from "drizzle-orm";
import * as schema from "./schema/index";
import { ConfigService } from "@nestjs/config";

export const DB = Symbol("DRIZZLE");
export type DrizzleDB = NodePgDatabase<typeof schema>;

export const DBProvider: FactoryProvider = {
	provide: DB,
	inject: [ConfigService],
	useFactory: async (configService: ConfigService) => {
		const logger = new Logger("DB");

		logger.debug("Connecting to DB...!");

		const connectionString = configService.get<string>("DATABASE_URL");
		const pool = new Pool({
			connectionString,
		});

		logger.debug("Connected to DB successfully!");

		class CustomDbLogWriter implements LogWriter {
			write(message: string) {
				logger.verbose(message);
			}
		}

		return drizzle(pool, {
			schema,
			logger: new DefaultLogger({ writer: new CustomDbLogWriter() }),
		});
	},
};
