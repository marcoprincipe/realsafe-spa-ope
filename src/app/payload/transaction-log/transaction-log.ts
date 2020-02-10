/**
 * Interface para armazenamento dos dados de
 * um log de transação.
 */

export interface TransactionLog {
	groupOwnerId: number;
	terminalId: string;
	nsuTerminal: string;
	companyId: number;
	companyName: string;
	unitId: number;
	unitName: string;
	userId: number;
	userName: string;
	functionalityId: number;
	functionalityName: string;
	accountingDate: Date;
	dateTime: Date;
	bankNotes: number;
	amount: number;
	status: string;
}