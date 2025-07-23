import {
	Res,
	Req,
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthLoginDto } from "./dto/authLogin.dto";
import type { Response, Request } from "express";
import { LocalAuthGuard } from "./guards/local.guard";
import { CurrentUser } from "./current-user.decorator";
import { User } from "../../drizzle/schema";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	create(@Body() dto: CreateUserDto) {
		return this.authService.register(dto);
	}

	@Post("login")
	@UseGuards(LocalAuthGuard)
	logint(@CurrentUser() user: User, @Res() res: Response) {
		return this.authService.login(user, res);
	}

	@Post("refresh")
	refresh(@Req() req: Request) {
		const refreshToken: string = req.cookies["refreshToken"];
		if (!refreshToken) throw new UnauthorizedException("Missing refresh token");
		return this.authService.refresh(refreshToken);
	}
}
