/**
 * Interface para armazenamento dos dados de uma unidade
 */

export interface Unit {
	unitId: number;
	initial: string;
	name: string;
	status: string;
	creationDate: Date;
	companyId: number;
}
