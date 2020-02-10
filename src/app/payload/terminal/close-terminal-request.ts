/**
 * Interface para armazenamento dos dados para fechamento do terminal.
 */

export interface CloseTerminalRequest {
	groupOwnerId: number;
	terminalId: string;
	unitId: number;
	userId: number;
	dateTime: Date;
	bankNotes: number;
	amount: number;
}