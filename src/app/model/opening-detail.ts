/**
 * Interface para armazenamento dos dados de um detalhe de abertura.
 */

export interface OpeningDetail {
	nsuTerminal: string,
	accountingDate: Date,
	openingDateTime: Date,
	bankNotesInSafe: number,
	amountInSafe: number,
	lastClosingDateTime: Date,
	lastClosingBanknotes: number,
	lastClosingAmount: number,
	etvClosing: string
}