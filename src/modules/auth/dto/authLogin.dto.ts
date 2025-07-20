import { MinLength, MaxLength, IsEmail, IsNotEmpty } from "class-validator";

export class AuthLoginDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(50)
	password: string;
}
