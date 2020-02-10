import { UserUnit } from './user-unit';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de lista de unidades de um usuário.
 */

export interface ListUserUnitsResponse {
    userUnits: Array<UserUnit>;
}