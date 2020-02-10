/**
 * Interface para armazenamento dos dados de retorno da efetivação
 * do recolhimento de numerario.
 */

export interface CollectCashResponse {
    dateTime: Date;
    rowsAffected: number;
    nsuTerminal: string;
}
