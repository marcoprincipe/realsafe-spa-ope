import { Injectable } from '@angular/core';
import { RestResponse, ListGroupsRequest } from '../payload';
import { Observable } from 'rxjs';
import { ResourceAccessService } from '../shared/services/resource-access.service';

/**
 * Serviço para acesso das funcionalidades de proprietários.
 */

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Retorna a lista dos grupos cadastrados.
   */

  public listGroups(): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("group", "listGroups").subscribe(
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
   * Retorna a lista de detalhes de um grupo.
   */

  public listGroupDetails(request: ListGroupsRequest): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("group", "findGroupById", request).subscribe(
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