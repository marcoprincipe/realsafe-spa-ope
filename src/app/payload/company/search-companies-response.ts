/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de uma empresa.
 */

export interface SearchCompaniesResponse {
    companyId: number;
    companyName: string;
    contactName: string;
    phoneNumber: number;
}