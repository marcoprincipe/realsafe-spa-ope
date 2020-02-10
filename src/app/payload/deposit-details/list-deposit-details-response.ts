import { DepositDetail } from 'src/app/model';

/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de depósito.
 */

export interface ListDepositDetailsResponse {
    depositDetails: DepositDetail[];
}