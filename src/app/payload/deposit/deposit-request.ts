import { BankNoteDeposit } from 'src/app/model';

/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para para efetuar depósito de valores.
 */

export interface DepositRequest {
	groupOwnerId: number;
	terminalId: string;
	unitId: number;
	userId: number;
	bankNotes: Array<BankNoteDeposit>; 
	amount: number;
}