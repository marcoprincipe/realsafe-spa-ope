import { TerminalStatus } from './terminal-status';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de fechemento do terminal.
 */

export interface CloseTerminalResponse {
    terminalStatus: TerminalStatus
}