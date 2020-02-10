/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para obtenção da lista de funcionalidades de um perfil.
 */

export interface ListFunctionalitiesByRoleIdRequest {
    roleId: number;
    parentId: number;
}