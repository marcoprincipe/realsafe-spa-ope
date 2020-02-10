/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para listar as empresas de um usuário.
 */

export interface ListUserCompaniesRequest {
    groupOwnerId?: number,
    groupId: number,
    userId: number,
}
