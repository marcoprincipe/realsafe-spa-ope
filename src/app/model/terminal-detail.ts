/**
 * Interface para armazenamento dos dados de um terminal
 */

export interface TerminalDetail {
    
    terminalId: number;
	userName: string;
    emailAddress: string;
    cellPhoneNumber: number;
	creationDate: Date;
	groupOwnerId: number;
	groupId: number;
    companyName: string;
	unitName: string;
	additionalInfo: string;
	status: string;
}