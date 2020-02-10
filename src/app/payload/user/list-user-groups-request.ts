/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para listar os grupos de um usuário.
 */

export interface ListUserGroupsRequest {
    groupOwnerId?: number,
    userId: number,
}
