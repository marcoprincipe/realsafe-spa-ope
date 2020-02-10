/**
 * Interface para armazenamento dos dados para pesquisa dos detalhes da abertura do terminal.
 */

export interface GetOpeningDetailRequest {
    dateTime: Date,
    nsuTerminal: string,
    unitName: string,
    terminalId: string,
    userName: string,
}