/**
 * Interface para armazenamento dos dados do
 * proprietário das empresas.
 */

export interface OwnerCompany {
	groupOwnerId: number;
	groupOwnerName: string;
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

}