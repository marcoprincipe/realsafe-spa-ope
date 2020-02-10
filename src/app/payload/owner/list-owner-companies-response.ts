import { OwnerCompany } from './owner-company';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de lista de empresas de um usuário.
 */

export interface ListOwnerCompaniesResponse {
    owners: Array<OwnerCompany>;
}