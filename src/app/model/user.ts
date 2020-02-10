/**
 * Interface para armazenamento dos dados de um usuário.
 */

export interface User {
    groupOwnerId?: number;
    userId?: number;
	name?: string;
	email?: string;
	password?: string;
	isBlocked?: string;
	loginRetries?: number;
	status?: string;
	creationDate?: Date;
}