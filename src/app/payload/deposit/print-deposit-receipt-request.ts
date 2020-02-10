import { BankNoteDeposit } from 'src/app/model';

/**
 * Interface para armazenamento dos dados para impressão do recibo de depósito.
 */

export interface PrintDepositReceiptRequest {
	nsuTerminal: string,
	companyName: string;
	unitName: string;
	userName: string,
	terminalId: string;
	dateTime: Date;
	bankNotes: Array<BankNoteDeposit>; 
	amount: number;
}