/**
 * Interface para armazenamento dos dados de
 * pesquisa de logs de transação.
 */

export interface SearchTransactionLogRequest {
	groupOwnerId: number;
	nsuTerminal: string;
	startDate: string;
	endDate: string;
}