import { TransportCompanyDetail } from 'src/app/model';

/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de uma ETV.
 */

export interface ListTransportCompanyDetailsResponse {
    transportCompanyDetails: TransportCompanyDetail[];
}