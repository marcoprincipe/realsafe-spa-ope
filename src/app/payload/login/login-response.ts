import { User } from '../../model/user';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de login.
 */

export interface LoginResponse {
    user: User;
}