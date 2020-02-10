import { UserGroup } from './user-group';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de lista de grupos de um usuário.
 */

export interface ListUserGroupsResponse {
    userGroups: Array<UserGroup>;
}