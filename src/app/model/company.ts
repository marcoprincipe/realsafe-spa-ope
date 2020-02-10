/**
 * Interface para armazenamento dos dados de uma empresa.
 */

export interface Company {
    companyId: number;
	initial: string;
	name: string;
	status: string;
	creationDate: Date;
}
