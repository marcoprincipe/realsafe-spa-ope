/**
 * Interface para armazenamento dos dados da pesquisa
 * de logs de transações.
 */

export interface ListTransactionLogRequest {
    groupOwnerId?: number;
    terminalId?: string;
}