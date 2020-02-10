/**
 * Interface para armazenamento dos dados de
 * uma empresa de um usuário.
 */

export interface UserCompany {
    groupId: number;
    groupName: string;
    companyId: number;
    companyName: string;
    userId: number,
    userName: string,
    roleId: number,
    roleInitial: string,
    roleName: string
}