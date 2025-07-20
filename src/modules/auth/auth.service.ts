import {
	UnauthorizedException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { AuthLoginDto } from "./dto/authLogin.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { comparePasswords } from "src/utils/password";
import { Payload } from "./types/jwt-payload";
import { Response } from "express";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: CreateUserDto) {
		try {
			const res = await this.userService.create(dto);
			return res;
		} catch (err) {
			throw new InternalServerErrorException(`Cannot register user ${err}`);
		}
	}

	async login(dto: AuthLoginDto, res: Response) {
		const { email, password } = dto;
		try {
			const user = await this.userService.findByEmail(email);
			if (!user) {
				throw new UnauthorizedException("Invalid credentials");
			}
			const matched = await comparePasswords(user.password, password);
			if (!matched) {
				throw new UnauthorizedException("Invalid credentials");
			}
			const payload: Payload = { sub: user.id, email: user.email };
			const { accessToken, refreshToken } = await this.generateTokens(payload);

			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 1000 * 60 * 60 * 24 * 7,
			});

			return res.json({ accessToken });
		} catch (err) {
			throw new InternalServerErrorException(`Cannot login user ${err}`);
		}
	}

	private async generateTokens(payload: Payload) {
		const accessToken = await this.jwtService.signAsync(payload, {
			secret: process.env.JWT_ACCESS_SECRET,
			expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
		});

		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: process.env.JWT_REFRESH_SECRET,
			expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
		});

		return { accessToken, refreshToken };
	}

	async refresh(refreshToken: string) {
		try {
			const payload: Payload = await this.jwtService.verifyAsync(refreshToken, {
				secret: process.env.JWT_REFRESH_SECRET,
			});
			const user = await this.userService.findOne(payload.sub);
			if (!user) throw new UnauthorizedException("Invalid refresh token");

			const newAccessToken = await this.jwtService.signAsync(payload, {
				secret: process.env.JWT_ACCESS_SECRET,
				expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
			});

			return { accessToken: newAccessToken };
		} catch (err) {
			throw new UnauthorizedException("Invalid refresh token");
		}
	}
}
