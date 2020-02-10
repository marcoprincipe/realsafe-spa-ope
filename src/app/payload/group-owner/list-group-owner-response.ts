import { GroupOwner } from './group-owner';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de lista de proprietário de grupo.
 */

export interface ListGroupOwnerResponse {
    groupOwners: Array<GroupOwner>;
}