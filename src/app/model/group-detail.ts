/**
 * Interface para armazenamento dos dados de um grupo
 */

export interface GroupDetail {
    groupOwnerId: number;
    companyId: number;
    companyName: string; 
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
    groupId: number;    

}