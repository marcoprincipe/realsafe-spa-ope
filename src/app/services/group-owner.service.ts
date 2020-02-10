import { Injectable } from '@angular/core';
import { RestResponse, GetGroupOwnerResponse, ListGroupOwnerRequest, ListGroupOwnerResponse, SearchGroupOwnerRequest, SearchGroupOwnerResponse } from '../payload';
import { Observable } from 'rxjs';
import { ResourceAccessService } from '../shared/services/resource-access.service';

/**
 * Serviço para acesso das funcionalidades de proprietário de grupos.
 */

@Injectable({
  providedIn: 'root'
})
export class GroupOwnerService {

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Retorna os dados do proprietário de grupos.
   */

  public getLocalGroupOwner(): Observable<RestResponse<GetGroupOwnerResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("localGroupOwner", "getLocalGroupOwner").subscribe(
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
   * Retorna a lista de proprietários cadastrados.
   */

  public listGroupOwner(): Observable<RestResponse<ListGroupOwnerResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("groupOwner", "listGroupOwner").subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  };
  
  /**
   * Retorna a lista de empresas cadastradas.
   */

  public searchGroupOwners(request: SearchGroupOwnerRequest): Observable<RestResponse<SearchGroupOwnerResponse[]>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("groupOwner", "searchGroupOwners", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  };
 /**
   * Retorna a lista de detalhes de um proprietário.
   */

  public listGroupOwnerDetails(request: ListGroupOwnerRequest): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("groupOwner", "findGroupOwnerById", request).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  };


}
