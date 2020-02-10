import { Injectable } from '@angular/core';
import { TerminalParameters } from 'src/app/enums';
import { TerminalService } from 'src/app/services/terminal.service';

/**
 * Serviço para tratamento das configurações da aplicação.
 */

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  /**
   * Declaração das constantes da classe.
   */

  private readonly _DEFAULT_ACCESS_MODE: string = "0";
  private readonly _DEFAULT_USE_VK: string = "true";
  private readonly _DEFAULT_INACTIVITY_TIMEOUT_ENABED: string = "true";
  private readonly _DEFAULT_INACTIVITY_TIMEOUT_VALUE: string = "300000";
  private readonly _DEFAULT_INACTIVITY_TIMEOUT_INTERVAL: string = "1000";
  private readonly _DEFAULT_CHECK_SENSORS: string = "true";
  private readonly _DEFAULT_CHECK_SENSORS_MILLIS: string = "1000";
  private readonly _DEFAULT_ACCOUNTING_DATE_MAX_DAYS: string = "3";
  
  /**
   * Declaração das variáveis membro.
   */

  public accessMode: number = 0;
  public useVK: boolean = true; 
  public inactivityTimeoutEnabled: boolean = true; 
  public inactivityTimeoutValue: number = 300000; 
  public inactivityTimeoutInterval: number = 1000; 
  public checkSensors: boolean = true;
  public checkSensorsMillis: number = 1000;
  public accountingDateMaxDays: number = 3;

  /**
   * Construtor default da classe.
   */

  constructor(private terminalService: TerminalService) {

    const accessMode: string = this.terminalService.parameters[TerminalParameters.ACCESS_MODE] || this._DEFAULT_ACCESS_MODE;
    this.accessMode = Number(accessMode);

    const useVK: string = this.terminalService.parameters[TerminalParameters.USE_VIRTUAL_KEYBOARD] || this._DEFAULT_USE_VK;
    this.useVK = this.stringToBoolean(useVK);

    const inactivityTimeoutEnabled: string = this.terminalService.parameters[TerminalParameters.INACTIVITY_TIMEOUT_ENABLED] || this._DEFAULT_INACTIVITY_TIMEOUT_ENABED;
    this.inactivityTimeoutEnabled = this.stringToBoolean(inactivityTimeoutEnabled);

    const inactivityTimeoutValue: string = this.terminalService.parameters[TerminalParameters.INACTIVITY_TIMEOUT_VALUE] || this._DEFAULT_INACTIVITY_TIMEOUT_VALUE;
    this.inactivityTimeoutValue = Number(inactivityTimeoutValue);

    const inactivityTimeoutInterval: string = this.terminalService.parameters[TerminalParameters.INACTIVITY_TIMEOUT_INTERVAL] || this._DEFAULT_INACTIVITY_TIMEOUT_INTERVAL;
    this.inactivityTimeoutInterval = Number(inactivityTimeoutInterval);

    const checkSensors: string = this.terminalService.parameters[TerminalParameters.CHECK_SENSORS_ENABLED] || this._DEFAULT_CHECK_SENSORS;
    this.checkSensors = this.stringToBoolean(checkSensors);

    const checkSensorsMillis: string = this.terminalService.parameters[TerminalParameters.CHECK_SENSORS_INTERVAL] || this._DEFAULT_CHECK_SENSORS_MILLIS;
    this.checkSensorsMillis = Number(checkSensorsMillis);

    const accountingDateMaxDays: string = this.terminalService.parameters[TerminalParameters.ACCOUNTING_DATE_MAX_DAYS] || this._DEFAULT_ACCOUNTING_DATE_MAX_DAYS;
    this.accountingDateMaxDays = Number(accountingDateMaxDays);
    
  }

  /**
   * Converte a string informada em um boolean.
   * 
   * @param value - Valor a ser convertido.
   */

  private stringToBoolean(value: string): boolean {

    const trues: string[] = [ "true", "yes", "on", "1" ];

    if (trues.indexOf(value.toLowerCase()) > -1) {
        return true;
    }

    return false;

  }

}
