/**
 * Interface para armazenamento dos dados de
 * uma unidade de um usuário.
 */

export interface UserUnit {
    groupId: number;
    groupName: string;
    companyId: number;
    companyName: string;
    unitId: number;
    unitName: string;
    userId: number,
    userName: string,
    roleId: number,
    roleInitial: string,
    roleName: string
}