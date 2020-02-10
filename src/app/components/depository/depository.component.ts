import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { messages } from '../../messages/AppMessages';
import { DepositRequest, DepositoryCountResponse, PrintDepositReceiptRequest } from 'src/app/payload';
import { Subscription } from 'rxjs';
import { ConfirmDepositDialogComponent } from './confirm-deposit-dialog/confirm-deposit-dialog.component';
import { BankNoteDeposit } from 'src/app/model';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { PrinterService } from 'src/app/services/printer.service';
import { DepositService } from 'src/app/services/deposit.service';
import { DepositoryService } from 'src/app/services/depository.service';

declare const $: any;

/**
 * Componente para tratamento do depósito de valores.
 */

@Component({
  selector: 'rs-depository',
  templateUrl: './depository.component.html',
  styleUrls: ['./depository.component.scss']
})
export class DepositoryComponent implements OnInit, OnDestroy {

  /**
   * Declaração das variáveis membro.
   */

  public confirmationData: any = {
    title: "Imprimir comprovante ?",
    bankNotes: [],
    amount: 0
  };

  private _depositDateTime: Date;

  private _nsuTerminal: string;

  public checking: boolean = true;
  public hasError: boolean = false;

  public message: string = "";

  public bankNotes: BankNoteDeposit[] = [];

  private _subscribe: Subscription = null;

  @ViewChild("confirmDepositDialog")
  private _confirmDepositDialog: ConfirmDepositDialogComponent;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param printerService - Instância do serviço de impressoras.
   * @param depositoryService - Instância do serviço de depositários.
   * @param depositService - Instância do serviço de depósitos.
   * @param transactionLogService - Instância do serviço de logs de transações.
   */

  constructor(
    private router: Router,
    private commAreaService: CommAreaService,
    private printerService: PrinterService,
    private depositService: DepositService,
    private depositoryService: DepositoryService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    this.checking = true;
    this.hasError = false

    this.checkPrinter();

  }
  
  /**
   * Efetua a verificação da impressora.
   */

  private checkPrinter(): void {

    this.message = messages["checking.printer"];

    this._subscribe = this.printerService.check().subscribe(
      (response) => {
        this.checkDepository();
      },
      (error) => {
        this.showErrorMessage(error, "check.services.failed");
      }
    );

  }
  
  /**
   * Efetua a verificação do depositário.
   */

  private checkDepository(): void {

    this.message = messages["checking.depository"];

    this._subscribe = this.depositoryService.check().subscribe(
      (response) => {
        this.startDeposit();
      },
      (error) => {
        this.showErrorMessage(error, "check.depository.failed");
      }
    );

  }

  /**
   * Inicializa o depositário.
   */

  private startDeposit(): void {

    this._subscribe = this.depositoryService.startDeposit().subscribe(
      (response) => {
        this.doDeposit();
      },
      (error) => {
        this.showErrorMessage(error, "depository.initialization.failed");
      }
    );

  }

  /**
   * Permite o depósito de notas. 
   */

  public doDeposit() {

    this.message = messages["insert.banknotes"];

    this._subscribe = this.depositoryService.deposit().subscribe(
      (response) => {
        setTimeout(() => {
          $("#btnFinalize").focus();
        }, 100);
          },
      (error) => {
        this.showErrorMessage(error, "deposit.failed");
      }
    );

  }

  /**
   * Finaliza a operação de depósito.
   * 
   * @param event - Objeto com os dados do evento recebido.
   */

  public onFinalizeClicked(event: MouseEvent) {

    this.endDeposit();

  }

  /**
   * Finaliza a operação de depósito.
   */

  private endDeposit(): void {

    this._subscribe = this.depositoryService.endDeposit().subscribe(
      (response) => {
        this.logDepositTransaction(response.data);
      },
      (error) => {
        this.showErrorMessage(error, "end.deposit.failed");
      }
    );

  }

  /**
   * Efetua a gravação do log de uma operação de depósito.
   */

  private logDepositTransaction(data: DepositoryCountResponse) {

    const request: DepositRequest = {
      groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
      terminalId: this.commAreaService.terminal.terminalId,
      unitId: this.commAreaService.unitId,
      userId: this.commAreaService.user.userId,
      bankNotes: data.bankNotes,
      amount: data.amount
    }

    this._subscribe = this.depositService.deposit(request).subscribe(
      (response) => {
        this._nsuTerminal = response.data.nsuTerminal
        this._confirmDepositDialog.bankNotes = response.data.bankNotes;
        this._confirmDepositDialog.amount = response.data.amount;
        this._depositDateTime = response.data.dateTime;
        this.showConfirmDialog();
      },
      (error) => {
        this.showErrorMessage(error, "log.deposit.transaction.failed");
      }
    );
  
  }

  /**
   * Apresenta o diálogo de confirmação de depósitos
   */

  private showConfirmDialog() {
    this._confirmDepositDialog.show();
  }

  /**
   * Imprime o comprovante do depósito.
   */

  public printReceipt(value: string): void {

    if (value === "N") {
        this.goBack();
        return;
    }

    this._confirmDepositDialog.hide();

    this.message = messages["printing.receipt"];

    const request: PrintDepositReceiptRequest = {
      nsuTerminal: this._nsuTerminal,
      companyName: this.commAreaService.userCompany.companyName,
      unitName: this.commAreaService.userUnit.unitName,
      userName: this.commAreaService.userUnit.userName,
      terminalId: this.commAreaService.terminal.terminalId,
      dateTime: this._depositDateTime,
      bankNotes: this._confirmDepositDialog.bankNotes,
      amount: this._confirmDepositDialog.amount
    };

    this._subscribe = this.depositService.printReceipt(request).subscribe(
      (response) => {
        this.goBack();
      },
      (error) => {
        this.showErrorMessage(error, "printing.receipt.failed");
      }
    );

  }

  /**
   * Apresenta a mensagem de erro.
   */

  private showErrorMessage(error: any, key?: string): void {

    if (error.status === 400) {
        this.message = messages.format(key, error.error.message);
        setTimeout(() => {
          this.goBack();
        }, 3000);
    } else if (error.status === 500) {
        this.message = messages.format(key, error.error.message);
    } else {
        this.message = messages.format("unknown.error", error.message);
    }

    this.checking = false;
    this.hasError = true;

  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    if (event.key !== 'Escape') {
        return;
    }

    this.goBack();

  }

  /**
   * Retorna para a tela de menu
   */

  public goBack() {

    this._confirmDepositDialog.hide();

    this.router.navigate(['menu']);

  }

  /**
   * Efetua o cleanup dos recursos utilizados.
   */

  ngOnDestroy(): void {
    
    this._subscribe.unsubscribe();

  }

}
