import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { messages } from 'src/app/messages/AppMessages';
import { FunctionalityRole } from 'src/app/payload';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { FunctionalityService } from 'src/app/services/functionality.service';
import { SensorsService } from 'src/app/services/sensors.service';

declare const $: any;

/**
 * Componente para tratamento das opções de menu.
 */

@Component({
  selector: 'rs-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ TimeoutService ]
})
export class MenuComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;
  private readonly _SET_FOCUS_TIMEOUT: number = 100;
  
  /**
   * Declaração das variáveis membro.
   */

  public functionalitiesRole: Array<FunctionalityRole> = new Array<FunctionalityRole>();

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  private _sensors: number[] = [];

  public toastHeader: string = "";
  public toastMessages: string[] = [];

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param functionalityService - Instância do serviço de funcionalidades.
   * @param timeoutService - Instância do serviço de timeout.
   * @param sensorsService - Instância do serviço da placa de sensores.
   */

  constructor(
    private router: Router,
    private commareaService: CommAreaService,
    private functionalityService: FunctionalityService,
    private timeoutService: TimeoutService,
    private sensorsService: SensorsService) { 
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    this.timeoutService.onTimeout(() => {
        this.goBack();
    });

    this.sensorsService.onSensorsChanged(
        (sensors: number[]) => {
          this.checkSensors(sensors);
        }, 1000
    );

    this.setFocus("opcao01");

    const roleId: number = this.commareaService.userUnit.roleId;

    this.functionalityService.listFunctionalitiesByRoleId(roleId, null).subscribe(
        (response) => {
          this.loadAccessKeys(response);
        },
        (error) => {
          console.log(error);
          if (error.status === 400) {
              this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
              this.setFocus("opcao01");
            });
          }
          else {
              this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
              this.setFocus("opcao01");
            });
          }
        }
    );

  }

  /**
   * Efetua a carga das teclas permitidas.
   * 
   * @param data - Array com as funcionalidades retornadas.
   */

  private loadAccessKeys(response: any): void {

    this.functionalitiesRole = response.data.functionalitiesRole;

  }

  /**
   * Efetua a verificação dos sensores.
   * 
   * @param sensors - Status atual dos sensores.
   */

  private checkSensors(sensors: number[]): void {

    this._sensors = sensors;

    let index: number = -1;

    this.toastHeader = messages["deposit.not.allowed"];
    this.toastMessages = [];

    // Verifica o byte 3 - Malote

    if (this._sensors[3] === 1) {
        index++;
        this.toastMessages[index] = "* " + messages["pouch.not.present"];
    }

    // Verifica o byte 5 - Porta do cofre

    if (this._sensors[5] === 1) {
        index++;
        this.toastMessages[index] = "* " + messages["safe.door.open"];
    }

    // Verifica o byte 10 - Vibração

    if (this._sensors[10] === 1) {
        index++;
        this.toastMessages[index] = "* " + messages["vibration.detected"];
    }

    if (index > -1) {
        $("#sensorsToast").toast({ autohide: false });
        $("#sensorsToast").toast("show");
    }
    else {
        $("#sensorsToast").toast("hide");
    }

}

  /**
   * Retorna o flag para habilitar / debabilitar o botão do menu.
   * 
   * @param index - Índice do botão no menu.
   */

  public disabledButton(index: number): boolean {

    const functionalityRole: FunctionalityRole = this.functionalitiesRole[index];

    return this.isButtonDisabled(functionalityRole);
  
  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    if (event.key === 'Escape') {
        if (this.commareaService.isUnique) {
            this.goBack();          
        }
        else {
            this.navigateTo('access-menu');
        }
    }

    this.timeoutService.reset();

    if (event.key === 'Enter') {
        return;
    }

    const functionalityRole: FunctionalityRole = this.findFunctionalityByAccessKey(event.key);

    if (!functionalityRole) {
        return;
    }

    if (this.isButtonDisabled(functionalityRole)) {
        return;
    }

    const route: string = functionalityRole.functionalityRoute;

    if (route) {
        this.navigateTo(route);
    }

  }

  /**
   * Verifica se o botão deve ser desabilitado.
   * 
   * @param functionalityRole - Funcionalidade selecionada.
   */

  private isButtonDisabled(functionalityRole: FunctionalityRole): boolean {

    const status: string = this.commareaService.terminalStatus.status;
    const etvClosing: string = this.commareaService.terminalStatus.etvClosing;
    const roleId: number = this.commareaService.userUnit.roleId;

    // Abertura

    if (functionalityRole.functionalityId === 1) {

        if (status === "O") { // Terminal já está aberto.
          return true;
        }

    }

    // Fechamento

    if (functionalityRole.functionalityId === 2) {

        if (status === "C") { // Terminal já está fechado.
            return true;
        }

        if (etvClosing === "Y" && roleId !== 7) { // Fechamento pela ETV e operador não ETV.
            return true;
        }

    }

    // Recolhimento de numerário.

    if (functionalityRole.functionalityId === 10) {

        if (status === "C") {  // Terminal fechado.
            return true;
        }
    
    }

    // Depósito.

    if (functionalityRole.functionalityId === 3) {

        if (status === "C") { /// Terminal fechado.
            return true;
        }

        if (this._sensors[3] === 1) { // Malote não está presente.
            return true;
        }

        if (this._sensors[5] === 1) { // Porta do cofre está aberta.
            return true;
        }

    }

    return false;

  }

  /**
   * Pesquisa pela rota a partir da ordem informada.
   * 
   * @param accessKey - Tecla de acesso a ser pesquisada.
   */

  private findFunctionalityByAccessKey(accessKey: string): FunctionalityRole {

    const result: FunctionalityRole[] = this.functionalitiesRole.filter((item) => {
        return item.functionalityAccessKey === accessKey;
    })

    if (result && result.length > 0) {
        return result[0];
    }

    return null;

  }

  /**
   * Recebe o evento mousedown da página.
   * 
   * @param event - Instância do evento de teclado.
   */

  @HostListener("document:click", ["$event"])
  public onMouseDown(event: MouseEvent) {

    this.timeoutService.reset();

  }

  /**
   * Volta para a tela de login.
   */

  public goBack(): void {
    this.navigateTo('login');
  }

  /**
   * Efetua a navegação para a rota especificada.
   * 
   * @param route - Rota de destino para a navegação.
   */

  public navigateTo(route: string) {
    this.router.navigate([route]);
  }

  /**
   * Posiciona o foco no campo informado.
   * 
   * @param fieldId - Identificador do campo para posicinamento.
   */

  private setFocus(fieldId: string): void {

    setTimeout(() => {
      $(`#${fieldId}`).focus();
    }, this._SET_FOCUS_TIMEOUT);

  }

  /**
   * Efetua o cleanup dos recursos do componente.
   */

  ngOnDestroy(): void {

    this.sensorsService.release();

    this.timeoutService.stop();

  }

}