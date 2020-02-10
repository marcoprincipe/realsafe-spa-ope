import { Injectable } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { RestResponse } from '../payload';
import { startWith } from 'rxjs/operators';
import { ResourceAccessService } from '../shared/services/resource-access.service';
import { AppConfigService } from '../shared/services/app-config.service';

/**
 * Serviço para acesso das funcionalidades de sensores.
 */

@Injectable({
  providedIn: 'root'
})
export class SensorsService {

  /**
   * Declaração das variáveis membro.
   */

  public isOpen: boolean = false;

  private _enabled: boolean = true;
  private _millis: number = 1000;
  private _subscription: Subscription = null;

  private _lastCheck: number[] = [];

  /**
   * Construtor default da classe.
   */

  constructor(
    private resourceAccessService: ResourceAccessService,
    private appConfigService: AppConfigService) { 

    this._enabled = this.appConfigService.checkSensors;
    this._millis = this.appConfigService.checkSensorsMillis;

  }

  /**
   * Efetua a abertura da placa de sensores.
   */

  public open(): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("sensors", "open").subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
          this.isOpen = true;
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  }

  /**
   * Efetua o fechamento da placa de sensores.
   */

  public close(): Observable<RestResponse<number>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("sensors", "close").subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
          this.isOpen = false;
        },
        (error) => {
          observer.error(error);
        }
      );

    });

  }


  /**
   * Registra a função de callback do timer.
   * 
   * @param callback - Função de callback a ser executada.
   * @param millis - Quantidade de milisegundos.
   */

  public onSensorsChanged(callback: Function, millis?: number) {

    if (this._enabled) {

        if (millis && millis > 0) {
            this._millis = millis;
        }

        this._lastCheck = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this._subscription = interval(this._millis).pipe(startWith(0)).subscribe(() => {

          this.getSensorsStatus().subscribe(
            (response) => {
              for (let index: number = 0; index < response.data.length; index++) {
                  if (response.data[index] !== this._lastCheck[index]) {
                    callback(response.data);
                    break;
                  }
              }
              this._lastCheck = response.data;
            }
        );

      });
              
    }

  }

  /**
   * Efetua a checagem da placa de sensores.
   */

  public getSensorsStatus(): Observable<RestResponse<number[]>> {

    return new Observable((observer) => {

      this.resourceAccessService.get("sensors", "getSensorsStatus").subscribe(
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
   * Libera os recursos utilizados.
   */

  public release(): void {

    if (this._subscription) {
        this._subscription.unsubscribe();
    }

  }
  
}
