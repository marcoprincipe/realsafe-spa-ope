/**
 * Interface para armazenamento dos dados para abertura do terminal.
 */

export interface OpenTerminalRequest {
	groupOwnerId: number;
	terminalId: string;
	unitId: number;
	userId: number;
	dateTime: Date;
	bankNotes: number;
	amount: number;
	accountingDate: string;
	etvClosing: string;
}