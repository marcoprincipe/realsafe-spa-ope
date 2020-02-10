/**
 * Interface para armazenamento dos dados de um parâmetro do terminal.
 */

export interface TerminalParameter {
	parameterId: string;
	parameterValue: string;
	description: string;
	status: string;
	creationDate: Date;
}