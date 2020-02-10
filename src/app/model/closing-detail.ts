/**
 * Interface para armazenamento dos dados de um detalhe de fechamento.
 */

export interface ClosingDetail {
	nsuTerminal: string,
	closingDateTime: Date,
	bankNotesInSafe: number,
	amountInSafe: number,
	lastOpeningDateTime: Date,
	lastOpeningBanknotes: number,
	lastOpeningAmount: number;
}