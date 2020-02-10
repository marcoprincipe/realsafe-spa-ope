/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para listar as unidades de um usuário.
 */

export interface ListUserUnitsRequest {
    groupOwnerId?: number,
    groupId: number,
    companyId: number,
    userId: number,
}
