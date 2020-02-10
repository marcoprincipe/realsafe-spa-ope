import { TerminalStatus } from './terminal-status';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de obtenção do terminal.
 */

export interface GetTerminalStatusResponse {
    terminalStatus: TerminalStatus
}