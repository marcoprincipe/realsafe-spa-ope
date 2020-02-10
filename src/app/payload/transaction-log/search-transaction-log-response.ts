import { TransactionLog } from './transaction-log';

/**
 * Interface para armazenamento dos dados de retorno
 * da pesquisa de logs de transações.
 */

export interface SearchTransactionLogResponse {
    transactionLogs: Array<TransactionLog>
}