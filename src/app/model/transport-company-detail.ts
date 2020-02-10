/**
 * Interface para armazenamento dos dados de uma ETV
 */

export interface TransportCompanyDetail {

    groupOwnerId: number;
    groupId: number;
    unitId: number;
    companyName: string;
    businessName: string;
    companyId: number;
    address: string;
    addressComplement: string;
    addressNeighborhood: string;
    cityName: string;
    stateCode: string;      
    siteAddress: string;
    contact: string;
    emailAddress: string;
    phoneNumber: string;      
    cellPhoneNumber: string;
    additionalInfo: string;
    status: string;
}