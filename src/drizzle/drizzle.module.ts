import { Global, Module } from "@nestjs/common";
import { DB, DBProvider } from "./drizzle.provider";

@Global()
@Module({
	providers: [DBProvider],
	exports: [DB],
})
export class DrizzleModule {}
