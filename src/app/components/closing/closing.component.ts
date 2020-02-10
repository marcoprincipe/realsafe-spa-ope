import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { TerminalStatus, GetTerminalStatusRequest, GetTerminalStatusResponse, CloseTerminalRequest, PrintCloseTerminalReceiptRequest } from 'src/app/payload';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { messages } from 'src/app/messages/AppMessages';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TerminalService } from 'src/app/services/terminal.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  lastOpeningDateTime: Date,
  lastOpeningAmout: number,
  closingDateTime: Date,
  amountInSafe: number
}

/**
 * Componente para fechamento do terminal.
 */

@Component({
  selector: 'rs-closing',
  templateUrl: './closing.component.html',
  styleUrls: ['./closing.component.scss'],
  providers: [ TimeoutService ]
})
export class ClosingComponent implements OnInit {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;

  /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    lastOpeningDateTime: null,
    lastOpeningAmout: 0.00,
    closingDateTime: null,
    amountInSafe: 0.00
  };

  private terminalStatus: TerminalStatus;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do serviço de navegação.
   * @param terminalService - Instância do serviço de terminais.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private terminalService: TerminalService,
    private commAreaService: CommAreaService,
    private timeoutService: TimeoutService) {
  };

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit(): void {

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
   * Apresenta os dados do status do terminal.
   * 
   * @param response - Dados do retorno da pesquisa do status do terminal.
   */

  private showTerminalStatusData(response: GetTerminalStatusResponse): void {

    this.terminalStatus = response.terminalStatus;

    this.form.lastOpeningDateTime = this.terminalStatus.lastOpeningDateTime;
    this.form.lastOpeningAmout = this.terminalStatus.lastOpeningAmount;
    this.form.closingDateTime = this.terminalStatus.dbDateTime;
    this.form.amountInSafe = this.terminalStatus.amountInSafe;

    this.setFocus("btnConfirm");

  }

  /**
   * Recebe o evento click do botão confirmar.
   */

  public onConfirm(): void {

    const request: CloseTerminalRequest = {
      groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
      unitId: this.commAreaService.unitId,
      userId: this.commAreaService.user.userId,
      terminalId: this.commAreaService.terminal.terminalId,
      bankNotes: this.terminalStatus.banknotesInSafe,
      dateTime: this.terminalStatus.dbDateTime,
      amount: this.terminalStatus.amountInSafe
    };

    this.terminalService.closeTerminal(request).subscribe(
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
   * Efetua a impressão do comprovante de fechamento do terminal.
   */

  private printReceipt(): void {

    const request: PrintCloseTerminalReceiptRequest = {
      nsu: this.commAreaService.terminalStatus.lastNSU,
      unitName: this.commAreaService.userUnit.unitName,
      companyName: this.commAreaService.userCompany.companyName,
      userName: this.commAreaService.user.name,
      terminalId: this.commAreaService.terminal.terminalId,
      dateTime: this.terminalStatus.dbDateTime,
      amount: this.terminalStatus.amountInSafe
    };

    this.terminalService.printCloseTerminalReceipt(request).subscribe(
      (response) => {
        this._textDialog.info(messages["closing.success"], this._SHOW_MESSAGE_DELAY, () => {
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
