import * as argon2 from "argon2";

export const hashPassword = async (password: string) => {
	return await argon2.hash(password, { hashLength: 40 });
};

export const comparePasswords = async (hashed: string, password: string) => {
	const isMatched = await argon2.verify(hashed, password);
	return isMatched;
};
