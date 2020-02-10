/**
 * Interface para armazenamento dos dados da requisição
 * do recurso para para efetuar a pesquisa de um detalhes de depósito.
 */

export interface ListDepositDetailsRequest {
    dateTime: Date,
    nsuTerminal: string,
    unitName: string,
    terminalId: string,
    userName: string,
    amount: number
}