import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [UsersModule, JwtModule, PassportModule],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
	exports: [AuthService],
})
export class AuthModule {}
