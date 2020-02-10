import { TransactionLog } from '../transaction-log/transaction-log';

/**
 * Interface para armazenamento dos dados de retorno da pesquisa
 * de detalhes do recolhimento de numerario.
 */

export interface ListCashCollectionDetailsResponse {
    transactionLogs: Array<TransactionLog>;
}
