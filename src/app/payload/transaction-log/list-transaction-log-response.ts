import { TransactionLog } from './transaction-log';

/**
 * Interface para armazenamento dos dados de retorno
 * da pesquisa de logs de transações.
 */

export interface ListTransactionLogResponse {
    transactionLogs: Array<TransactionLog>
}