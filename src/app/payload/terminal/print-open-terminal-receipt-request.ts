/**
 * Interface para armazenamento dos dados para impressão do recibo de abertura.
 */

export interface PrintOpenTerminalReceiptRequest {
	nsu: string;
	companyName: string;
	unitName: string;
	userName: string;
	terminalId: string;
	dateTime: Date;
	amount: number;
}