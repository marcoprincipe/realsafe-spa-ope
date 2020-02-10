/**
 * Interface para armazenamento dos dados da pesquisa
 * dos detalhes do recolhimento de numerario.
 */

export interface ListCashCollectionDetailsRequest {
	dateTime: Date;
	unitName: string;
	terminalId: string;
	userName: string;
	cashCollectionNsu: string;
	bankNotes?: number;
	amount?: number;
}
