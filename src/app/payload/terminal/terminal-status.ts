/**
 * Interface para armazenamento dos dados do status do terminal.
 */

export interface TerminalStatus {
	terminalId: string,
	accountingDate: string,
	banknotesInSafe: number,
	amountInSafe: number,
	lastOpeningDateTime: Date,
	lastOpeningBanknotes: number,
	lastOpeningAmount: number,
	lastClosingDateTime: Date,
	lastClosingBanknotes: number,
	lastClosingAmount: number,
	status: string;
	dbDateTime: Date,
	etvClosing: string
	lastNSU: string;
}