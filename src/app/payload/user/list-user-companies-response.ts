import { UserCompany } from './user-company';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de lista de empresas de um usuário.
 */

export interface ListUserCompaniesResponse {
    userCompanies: Array<UserCompany>;
}