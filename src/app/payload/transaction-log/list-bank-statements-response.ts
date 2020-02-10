import { BankStatementLine } from './bank-statement-line';

/**
 * Interface para armazenamento dos dados de retorno
 * dos logs de transações.
 */

export interface ListBankStatementsResponse {
    statements: Array<BankStatementLine>
}