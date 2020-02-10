import { TerminalParameter } from 'src/app/model';

/**
 * Interface para armazenamento dos dados de retorno
 * da operação de lista dos parâmetros do terminal.
 */

export interface ListTerminalParametersResponse {
    parameters: Array<TerminalParameter>
}