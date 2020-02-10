import { GroupOwner } from './group-owner';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de obtenção do proprietário de grupos.
 */

export interface GetGroupOwnerResponse {
    groupOwner: GroupOwner
}