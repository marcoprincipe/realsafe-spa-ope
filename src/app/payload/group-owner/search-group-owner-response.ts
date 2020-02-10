import { OwnerDetail } from 'src/app/model';

/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de proprietarios de grupo.
 */

export interface SearchGroupOwnerResponse {

    groupOwners: OwnerDetail[];
}