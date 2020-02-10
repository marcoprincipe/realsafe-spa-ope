import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestResponse, DepositoryCountResponse } from '../payload';
import { DepositoryStatus } from '../payload/depository/depository-status';
import { ResourceAccessService } from '../shared/services/resource-access.service';

/**
 * Serviço para acesso das funcionalidades de depositários.
 */

@Injectable({
  providedIn: 'root'
})
export class DepositoryService {

  /**
   * Construtor default da classe.
   */

  constructor(
    private resourceAccessService: ResourceAccessService) { 
  }

  /**
   * Efetua a abertura do depositário.
   */

  public open(): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "open").subscribe(
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
   * Efetua o fechamento do depositário.
   */

  public close(): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "close").subscribe(
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
   * Efetua a checagem do depositário.
   */

  public check(): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "check").subscribe(
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
   * Obtem o status do depositário.
   */

  public getStatus(): Observable<RestResponse<DepositoryStatus>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "getStatus").subscribe(
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
   * Inicializa o depositário.
   */

  public startDeposit(): Observable<number> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "startDeposit").subscribe(
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
   * Efetua um depósito de valores.
   */

  public deposit(): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "deposit").subscribe(
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
   * Finaliza um depósito de valores.
   */

  public endDeposit(): Observable<RestResponse<DepositoryCountResponse>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "endDeposit").subscribe(
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
   * Efetua a inicialização do depositário.
   */

  public reset(): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("depository", "reset").subscribe(
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

}
