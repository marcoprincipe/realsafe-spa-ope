/**
 * Interface para armazenamento da requisição do recurso
 * para adicionar uma filial
 */

export interface UnitRequest {	
    unitId: number;
	unitName: string;
	businessName: string;
	address: string;
	addressNumber: string;
	addressComplement: string;
	addressNeighborhood: string;
	cityName: string;
	stateCode: string;
	countryCode: string;
	zipCode: number;
	phoneCountryCode: number;
	phoneAreaCode: number;
	phoneNumber: number;
	siteAddress: string;
	emailAddress: string;
	additionalInfo: string;
	status: string;
	creationDate: Date;
	companyId: number
}