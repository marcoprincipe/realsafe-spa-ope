/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para efetuar a troca de senha de um usuário.
 */

export interface ChangePasswordRequest {
    groupOwnerId?: number,
    userId: number,
    password: string
}
