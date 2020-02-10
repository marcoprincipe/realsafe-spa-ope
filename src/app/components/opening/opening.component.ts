import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetTerminalStatusRequest, TerminalStatus, GetTerminalStatusResponse, OpenTerminalRequest, PrintOpenTerminalReceiptRequest } from 'src/app/payload';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { messages } from 'src/app/messages/AppMessages';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { Formatter } from 'src/app/shared/formatters';
import { DateValidator } from 'src/app/shared/validators';
import { DateConverter } from 'src/app/shared/converters';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TerminalService } from 'src/app/services/terminal.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  lastClosingDateTime: Date,
  lastClosingAmount: number,
  openingDateTime: Date,
  amountInSafe: number,
  accountingDate: string,
  etvClosing: string
}

/**
 * Componente para abertura do terminal.
 */

@Component({
  selector: 'rs-opening',
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.scss'],
  providers: [ TimeoutService ]
})
export class OpeningComponent implements OnInit {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;

  /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    lastClosingDateTime: null,
    lastClosingAmount: 0.00,
    openingDateTime: null,
    amountInSafe: 0.00,
    accountingDate: "",
    etvClosing: "N"
  };

  public useVK: boolean = true;
  private terminalStatus: TerminalStatus;

  /**
   * Instância do teclado virtual.
   */

  @ViewChild(KeyboardComponent)
  private _keyboardComponent: KeyboardComponent;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do serviço de navegação.
   * @param appConfigService - Instância do serviço de configurações.
   * @param terminalService - Instância do serviço de terminais.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private appConfigService: AppConfigService,
    private terminalService: TerminalService,
    private commAreaService: CommAreaService,
    private timeoutService: TimeoutService) {
  };

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit(): void {

    this.useVK = this.appConfigService.useVK;

    this.timeoutService.onTimeout(() => {
      this.goBack();
    });

    const request: GetTerminalStatusRequest = {
      terminalId: this.commAreaService.terminal.terminalId
    };

    this.terminalService.getTerminalStatus(request).subscribe(
      (response) => {
        this.showTerminalStatusData(response.data);
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnCancel");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnCancel");
          });
        }
      }
    );

  }

  /**
   * Apresenta o teclado virtual.
   * 
   * @param params - Parâmetros a serem passados para o teclado virtual.
   */

  public showKeyboard(params: any) {

    if (this.useVK) {
        const value: string = $(`#${params.fieldId}`).val();
        this._keyboardComponent.show({ 
        "fieldId": params.fieldId, 
        "value": Formatter.unFormat(value) || "", 
        "isPassword": params.isPassword || false, 
        "isNumeric": params.isNumeric || false, 
        "maxLength": params.maxLength || 0,
        "kbType": params.kbType || "alpha" });
    }
  
  }

  /**
   * Recebe o evento do pressionamento da tecla enter no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onEnterClicked(event: any) {
    if (event.fieldId === "accountingDate") {
      this.form[`${event.fieldId}`] = Formatter.datePtBR(Formatter.padLeft(event.value, "0", 8));
    }
    else {
      this.form[`${event.fieldId}`] = event.value;
    }
    $(`#${event.fieldId}`).focus();
  }

  /**
   * Recebe o evento do pressionamento da tecla cancelar no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onCancelClicked(event: any) {
    this.form[`${event.fieldId}`] = event.value;
    $(`#${event.fieldId}`).focus();
  }

  /**
   * Apresenta os dados do status do terminal.
   * 
   * @param response - Dados do retorno da pesquisa do status do terminal.
   */

  private showTerminalStatusData(response: GetTerminalStatusResponse): void {

    this.terminalStatus = response.terminalStatus;

    this.form.lastClosingDateTime = this.terminalStatus.lastClosingDateTime;
    this.form.lastClosingAmount = this.terminalStatus.lastClosingAmount;
    this.form.openingDateTime = this.terminalStatus.dbDateTime;
    this.form.amountInSafe = this.terminalStatus.amountInSafe;
    this.form.accountingDate = Formatter.datePtBR(new Date());
    this.form.etvClosing = null;

    this.setFocus("accountingDate");

  }

  /**
   * Recebe o evento click do botão confirmar.
   */

  public onConfirm(): void {

    const accountingDate: string = this.checkAccountingDate();

    if (accountingDate === null) {
      this._textDialog.error(messages["invalid.accouunting.date"], this._SHOW_MESSAGE_DELAY, () => {
        this.setFocus("accountingDate");
      });
      return;
    }

    const isChecked: boolean = $("#etvClosing").is(":checked");

    const request: OpenTerminalRequest = {
      groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
      unitId: this.commAreaService.unitId,
      userId: this.commAreaService.user.userId,
      terminalId: this.commAreaService.terminal.terminalId,
      bankNotes: this.terminalStatus.banknotesInSafe,
      dateTime: this.terminalStatus.dbDateTime,
      amount: this.terminalStatus.amountInSafe,
      accountingDate: accountingDate,
      etvClosing: (isChecked ? "Y" : "N")
    };

    this.terminalService.openTerminal(request).subscribe(
      (response) => {
        this.commAreaService.terminalStatus = response.data.terminalStatus;
        this.printReceipt();
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnCancel");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnCancel");
          });
        }
      }
    );

  }

  /**
   * Verifica a data contábil informada
   */

  public checkAccountingDate(): string {

    let accountingDate: string = null;

    if (this.form.accountingDate) {
      if (!DateValidator.validatePtBR(this.form.accountingDate)) {
          return null;
      }
    }

    if (this.form.accountingDate) {
        accountingDate = DateConverter.ptBR2EnUS(this.form.accountingDate);
    }

    const curDate: Date = new Date();
    const nowDate: Date = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
    const maxDate: Date = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + this.appConfigService.accountingDateMaxDays);
    const accDate: Date = new Date(`${accountingDate}T00:00:00.000`);
    
    if (accDate < nowDate) {
        return null;
    }

    if (accDate > maxDate) {
        return null;      
    }

    return accountingDate;

  }

  /**
   * Habilita ou desabilita o botão de confirmação.
   */

  public disableBtnConfirm(): boolean {

    if (!this.form.accountingDate || 
        this.form.accountingDate.trim() === "") {
        return true;
    }

    return false;

  }

  /**
   * Efetua a impressão do comprovante de abertura do terminal.
   */

  private printReceipt(): void {

    const request: PrintOpenTerminalReceiptRequest = {
      nsu: this.commAreaService.terminalStatus.lastNSU,
      unitName: this.commAreaService.userUnit.unitName,
      companyName: this.commAreaService.userCompany.companyName,
      userName: this.commAreaService.user.name,
      terminalId: this.commAreaService.terminal.terminalId,
      dateTime: this.terminalStatus.dbDateTime,
      amount: this.terminalStatus.amountInSafe
    };

    this.terminalService.printOpenTerminalReceipt(request).subscribe(
      (response) => {
        this._textDialog.info(messages["opening.success"], this._SHOW_MESSAGE_DELAY, () => {
          this.goBack();
        });
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnCancel");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnCancel");
          });
        }
      }
    );
    
  }

  /**
   * Recebe o evento click do botão cancelar.
   */

  public onCancel(): void {
    this.goBack();
  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    this.timeoutService.reset();

    if (event.key === 'Escape') {
        this.goBack();
    }

  }

  /**
   * Recebe o evento mousedown do documento.
   */

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: any) {

    this.timeoutService.reset();

  }

  /**
   * Retorna para a tela de menu.
   */

  public goBack() {
    this.router.navigate(['menu']);
  }

  /**
   * Posiciona o foco no campo informado.
   * 
   * @param fieldId - Identificador do campo para posicinamento.
   */

  private setFocus(fieldId: string): void {

    setTimeout(() => {
      $(`#${fieldId}`).focus();
    }, 250);

  }

}
