/**
 * Interface para armazenamento dos dados da efetivação
 * do recolhimento de numerario.
 */

export interface CollectCashRequest {
	groupOwnerId: number,
	terminalId: string,
	unitId: number,
	userId: number,
	bankNotes: number,
	amount: number
}
