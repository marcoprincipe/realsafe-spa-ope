/**
 * Interface para armazenamento dos dados do terminal.
 */

export interface Terminal {
	terminalId: string
	terminalName: string,
	status: string,
	creationDate: Date,
	groupOwnerId: number
}