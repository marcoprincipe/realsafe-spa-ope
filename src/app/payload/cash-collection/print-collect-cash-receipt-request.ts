import { TransactionLog } from '../transaction-log/transaction-log';

/**
 * Interface para armazenamento dos dados para impressão do recibo de recolhimento de numerário.
 */

export interface PrintCollectCashReceiptRequest {
	nsuTerminal: string;
	terminalId: string;
	companyName: string;
	unitName: string;
	userName: string;
	dateTime: Date;
	amount: number;
	transactionLogs: Array<TransactionLog>;
}