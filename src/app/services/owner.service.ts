import { Injectable } from '@angular/core';
import { RestResponse, ListGroupOwnerRequest, ListGroupOwnerResponse } from '../payload';
import { Observable } from 'rxjs';
import { ResourceAccessService } from '../shared/services/resource-access.service';

/**
 * Serviço para acesso das funcionalidades de proprietários.
 */

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

 /**
   * Retorna a lista de detalhes de um proprietário.
   */

  public listOwnerDetails(request: ListGroupOwnerRequest): Observable<RestResponse<any>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("owner", "findOwnerById", request).subscribe(
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