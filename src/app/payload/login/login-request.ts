/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para efetuar o login de um usuário.
 */

export interface LoginRequest {
    groupOwnerId?: number,
    userId: number,
    password: string
}
