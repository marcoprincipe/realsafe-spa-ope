/**
 * Interface para armazenamento dos dados para impressão do recibo de fechamento.
 */

export interface PrintCloseTerminalReceiptRequest {
	nsu: string;
	unitName: string;
	companyName: string;
	userName: string;
	terminalId: string;
	dateTime: Date;
	amount: number;
}