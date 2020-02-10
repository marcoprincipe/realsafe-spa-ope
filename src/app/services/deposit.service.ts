import { Injectable } from '@angular/core';
import { DepositRequest, DepositResponse, RestResponse, PrintDepositReceiptRequest } from '../payload';
import { Observable } from 'rxjs';
import { ResourceAccessService } from '../shared/services/resource-access.service';

/**
 * Serviço para acesso das funcionalidades de transações de depósito.
 */

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  /**
   * Construtor default do serviço.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Efetua a gravação dos dados de uma transação de depósito.
   */

  public deposit(request: DepositRequest): Observable<RestResponse<DepositResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("deposit", "deposit", request).subscribe(
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
   * Efetua a gravação dos dados de uma transação de depósito.
   */

  public printReceipt(request: PrintDepositReceiptRequest): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.post("deposit", "printDepositReceipt", request).subscribe(
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
