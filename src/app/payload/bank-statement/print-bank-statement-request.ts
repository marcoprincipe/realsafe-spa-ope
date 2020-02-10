import { TransactionLog } from '../transaction-log/transaction-log';

/**
 * Interface para armazenamento dos dados para impressão do recibo de depósito.
 */

export interface PrintBankStatementRequest {
	companyName: string;
	unitName: string;
	userName: string,
	terminalId: string;
	transactionLogs: Array<TransactionLog>; 
}