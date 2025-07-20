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
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthLoginDto } from "./dto/authLogin.dto";
import { Response, Request } from "express";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	create(@Body() dto: CreateUserDto) {
		return this.authService.register(dto);
	}

	@Post("login")
	logint(@Res() res: Response, @Body() dto: AuthLoginDto) {
		return this.authService.login(dto, res);
	}

	@Post("refresh")
	refresh(@Req() req: Request) {
		const refreshToken: string = req.cookies["refreshToken"];
		if (!refreshToken) throw new UnauthorizedException("Missing refresh token");
		return this.authService.refresh(refreshToken);
	}
}
