import { OwnerDetail } from 'src/app/model';

/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de um proprietario de grupo.
 */

export interface ListGroupOwnerDetailsResponse {
    groupOwnerDetails: OwnerDetail[];
}