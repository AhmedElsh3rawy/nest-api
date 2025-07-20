import {
	IsAlphanumeric,
	IsEmail,
	IsNotEmpty,
	MaxLength,
	MinLength,
} from "class-validator";

export class CreateUserDto {
	@MinLength(3)
	@IsNotEmpty()
	@IsAlphanumeric()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(50)
	password: string;
}
