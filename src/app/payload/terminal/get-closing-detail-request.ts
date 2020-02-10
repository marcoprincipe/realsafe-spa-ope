/**
 * Interface para armazenamento dos dados para pesquisa dos detalhes do fechamento do terminal.
 */

export interface GetClosingDetailRequest {
    dateTime: Date,
    nsuTerminal: string,
    unitName: string,
    terminalId: string,
    userName: string,
}