/**
 * Interface para armazenamento da requisição do recurso
 * para adicionar uma empresa
 */

export interface CompanyRequest {
	//groupOwnerId: number;
    companyId: number;
    companyName: string;
	businessName: string;
    groupId: number;
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
    //creationDate: Date;

}