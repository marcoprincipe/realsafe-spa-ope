import { Injectable } from '@angular/core';
import { ResourceAccessService } from '../shared/services/resource-access.service';
import { Observable } from 'rxjs';
import { RestResponse } from '../payload/rest-response';
import { LoginRequest } from '../payload/login/login-request';
import { LoginResponse } from '../payload/login/login-response';
import { User } from '../model/user';
import { ListUserGroupsRequest, ListUserGroupsResponse, ListUserCompaniesRequest, ListUserCompaniesResponse, ListUserUnitsRequest, ListUserUnitsResponse, ChangePasswordRequest } from '../payload';

/**
 * Serviço para acesso das funcionalidades de usuários.
 */

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * Declaração das variáveis membro
   */

  private _loggedUser: User;

  /**
   * Construtor default da classe.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Efetua o login do usuário.
   * 
   * @param request - Objeto com os dados do login.
   */

  public login(request: LoginRequest): Observable<RestResponse<LoginResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("user", "login", request).subscribe(
        (response) => {
          this._loggedUser = response.data.user;
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  }

  /**
   * Efetua a troca de senha do usuário.
   * 
   * @param request - Objeto com os dados para a troca de senha.
   */

  public changePassword(request: ChangePasswordRequest): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("user", "changePassword", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  }

  /**
   * Retorna a lista de grupos de um usuário.
   * 
   * @param request - Objeto com os dados para pesquisa dos grupos.
   */

  public listUserGroups(request: ListUserGroupsRequest): Observable<RestResponse<ListUserGroupsResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("user", "listUserGroups", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  }

  /**
   * Retorna a lista de empresas de um usuário.
   * 
   * @param request - Objeto com os dados para pesquisa das empresas.
   */

  public listUserCompanies(request: ListUserCompaniesRequest): Observable<RestResponse<ListUserCompaniesResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("user", "listUserCompanies", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  }

  /**
   * Retorna a lista de unidades de um usuário.
   * 
   * @param request - Objeto com os dados para pesquisa das unidades.
   */

  public listUserUnits(request: ListUserUnitsRequest): Observable<RestResponse<ListUserUnitsResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("user", "listUserUnits", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  }

  /**
   * Retorna os dados do usuário logado.
   */

  public getLoggedUser(): User {
    return this._loggedUser;
  }

}
