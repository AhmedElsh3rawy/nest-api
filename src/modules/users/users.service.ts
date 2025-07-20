import {
	Injectable,
	Inject,
	InternalServerErrorException,
	BadRequestException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DB, type DrizzleDB } from "../../drizzle/drizzle.provider";
import { usersTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../utils/password";

@Injectable()
export class UsersService {
	constructor(@Inject(DB) private readonly db: DrizzleDB) {}

	async create(createUserDto: CreateUserDto) {
		const user = await this.findByEmail(createUserDto.email);
		if (user) {
			throw new BadRequestException("Email is already in use.");
		}
		try {
			const hashed = await hashPassword(createUserDto.password);
			const res = await this.db
				.insert(usersTable)
				.values({ ...createUserDto, password: hashed })
				.returning();
			return res[0];
		} catch (err) {
			throw new InternalServerErrorException(`Cannot create user ${err}`);
		}
	}

	async findAll() {
		try {
			const res = await this.db.select().from(usersTable);
			return res;
		} catch (err) {
			throw new InternalServerErrorException(`Cannot find users ${err}`);
		}
	}

	async findOne(id: number) {
		try {
			const res = await this.db
				.select()
				.from(usersTable)
				.where(eq(usersTable.id, id));
			return res[0];
		} catch (err) {
			throw new InternalServerErrorException(`Cannot get user ${err}`);
		}
	}

	async findByEmail(email: string) {
		try {
			const res = await this.db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email));
			return res[0];
		} catch (err) {
			throw new InternalServerErrorException(`Cannot get user ${err}`);
		}
	}

	async findByName(name: string) {
		try {
			const res = await this.db
				.select()
				.from(usersTable)
				.where(eq(usersTable.name, name));
			return res[0];
		} catch (err) {
			throw new InternalServerErrorException(`Cannot get user ${err}`);
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		try {
			const res = await this.db
				.update(usersTable)
				.set({ ...updateUserDto })
				.where(eq(usersTable.id, id))
				.returning();
			return res[0];
		} catch (err) {
			throw new InternalServerErrorException(`Cannot update user ${err}`);
		}
	}

	async remove(id: number) {
		try {
			const res = await this.db
				.delete(usersTable)
				.where(eq(usersTable.id, id))
				.returning();
			return res[0];
		} catch (err) {
			throw new InternalServerErrorException(`Cannot remove user ${err}`);
		}
	}
}
