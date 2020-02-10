import { CompanyDetail } from 'src/app/payload';

/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de uma empresa.
 */

export interface ListCompanyDetailsResponse {
	company: Array<CompanyDetail>;
}