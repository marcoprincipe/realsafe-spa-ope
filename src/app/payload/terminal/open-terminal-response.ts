import { TerminalStatus } from './terminal-status';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de abertura do terminal.
 */

export interface OpenTerminalResponse {
    terminalStatus: TerminalStatus
}