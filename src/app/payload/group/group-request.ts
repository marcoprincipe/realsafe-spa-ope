/**
 * Interface para armazenamento da requisição do recurso
 * para adicionar um grupo
 */

export interface GroupRequest {	
    groupId: number;
    groupName: string;
    businessName: string;
    address: string;
    addressNumber: string;
    addressComplement: string;
    addressNeighborhood: string;
    zipCode: number;
    phoneCountryCode: number;
    phoneAreaCode: number;
    phoneNumber: number;
    siteAddress: string;
    emailAddress: string;
    additionalInfo: string;
    status: string;
    creationDate: Date;
    cityId: number;
}