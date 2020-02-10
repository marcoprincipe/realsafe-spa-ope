import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AppConfigService } from './app-config.service';

/**
 * Serviço para tratamento de timeouts da aplicação.
 */


@Injectable()
export class TimeoutService implements OnDestroy {

  /**
   * Declaração das variáveis membro
   */

  private _enabled: boolean = false;
  private _millis: number = 0;
  private _interval: number = 0;
  private _elapsed: number = 0;
  private _callback: Function = null;
  private _subscription: Subscription = null;
  
  /**
   * Construtor default da classe
   */

  constructor(private appConfigService: AppConfigService) {

    this._enabled = this.appConfigService.inactivityTimeoutEnabled;
    this._millis = this.appConfigService.inactivityTimeoutValue;
    this._interval = this.appConfigService.inactivityTimeoutInterval;

  }

  /**
   * Registra a função de callback do timer.
   * 
   * @param callback - Função de callback a ser executada.
   * @param millis - Quantidade de milisegundos.
   */

  public onTimeout(callback: Function, millis?: number) {

    if (this._enabled) {

        if (millis && millis > 0) {
            this._millis = millis;
        }

        this._callback = callback;

        this.execute();
              
    }

  }

  /**
   * Executa a contagem do timer.
   */

  private execute(): void {

    this._elapsed = this._millis;

    this._subscription = interval(this._interval).subscribe(() => {

      this._elapsed -= this._interval;

      if (this._elapsed <= 0) {

          this.stop();

          if (this._callback) {
              this._callback();
          }

      }

    });

  }

  /**
   * Encerra a execução do timer.
   */

  public stop(): void {

    if (this._enabled) {

        if (this._subscription) {
          this._subscription.unsubscribe();
        }

    }

  }

  /**
   * Incializa a o timer.
   */

  public reset(): void {

    if (this._enabled) {

        this.stop();
        this.execute();
    
    }

  }

  /**
   * Efetua o cleanup dos recursos do serviço.
   */

  ngOnDestroy(): void {

    if (this._enabled) {
        this.stop();
    }

  }

}