import { TerminalDetail } from 'src/app/model';

/**
 * Interface para armazenamento dos dados do
 * resultado da pesquisa de detalhes de um terminal.
 */

export interface ListTerminalDetailsResponse {
    terminalDetails: TerminalDetail[];
}