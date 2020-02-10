
/**
 * Interface para armazenamento dos dados de retorno
 * de uma linha dos logs de transações.
 */

export interface BankStatementLine {
	companyId: number,
	companyName: string,
	unitId: number,
	unitName: string,
	userId: number,
	userName: string,
	userEmail: string,
	transactionId: number,
	transactionName: string,
	transactionDate: Date,
	amount: number
}