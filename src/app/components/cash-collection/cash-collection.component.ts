import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionLog, ListTransactionLogRequest, ListDepositDetailsRequest, CollectCashRequest, PrintCollectCashReceiptRequest } from 'src/app/payload';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { messages } from 'src/app/messages/AppMessages';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { CashCollectionService } from 'src/app/services/cash-collection.service';
import { TransactionLogService } from 'src/app/services/transaction-log.service';

declare const $: any;

/**
 * Componente para recolhimento de numerário.
 */

@Component({
  selector: 'rs-cash-collection',
  templateUrl: './cash-collection.component.html',
  styleUrls: ['./cash-collection.component.scss'],
  providers: [ TimeoutService ]
})
export class CashCollectionComponent implements OnInit {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;

  private readonly _TAB_MAX_ROWS: number = 5;
  private readonly _ALLOWED_KEYS: string[] = 
        ["0", "1", "2", "3",  "4", "5", "6", "7", "8", "9", 
         "n", "N", "p", "P", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Escape"];

  /**
   * Declaração das variáveis membro.
   */

  private _dateTime: Date;
  private _nsuTerminal: string;

  public page: number = 1;
  public pages: number = 0;
  public amount: number = 0;
  public bankNotes: number = 0;

  public isDepositDetail: boolean = false;

  public _cache: Array<TransactionLog>;
  public transactionLogs: Array<TransactionLog>;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param transactionLogService - Instância do serviço de log de transações.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private commAreaService: CommAreaService,
    private cashCollectionService: CashCollectionService,
    private transactionLogService: TransactionLogService,
    private timeoutService: TimeoutService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    this.timeoutService.onTimeout(() => {
      this.goLoginPage();
    });

    const request: ListTransactionLogRequest = {
      terminalId: this.commAreaService.terminal.terminalId
    }

    this.transactionLogService.listPendentDeposits(request).subscribe(
      (response) => {
        this.showPendentDeposits(response.data.transactionLogs);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  /**
   * Apresenta os depósitos pendentes de recolhimento.
   * 
   * @param transactionLogs - Lista de depósitos pendentes de recolhimento.
   */

  private showPendentDeposits(transactionLogs: Array<TransactionLog>) {

    this._cache = transactionLogs;

    this.pages = Math.ceil(this._cache.length / this._TAB_MAX_ROWS);

    this.amount = 0;
    this.bankNotes = 0;

    this._cache.forEach((item) => {
        this.bankNotes += item.bankNotes;
        this.amount += item.amount;
      }
    );

    this.paginate();

    if (this.amount > 0) {
        this.setFocus("btnConfirm");
    }
    else {
        this.setFocus("btnCancel");
    }

  }

  /**
   * Avança para a próxima página.
   */

  public previousPage(): void {

    this.page -= 1;

    if (this.page < 1) {
        this.page = 1;
    }

    this.paginate();

  }

  /**
   * Avança para a próxima página.
   */

  public nextPage(): void {

    this.page += 1;

    if (this.page > this.pages) {
        this.page = this.pages;
    }

    this.paginate();

  }

  /**
   * Posiciona na página informada.
   * 
   * @param page - Página a ser apresentada.
   */

  public gotoPage(page: number) {

    if (page <= 0 || page > this.pages) {
        return;
    }

    this.page = page;

    this.paginate();

  }

  /**
   * Efetua a paginação para a página informada.
   * 
   * @param page - Número da página.
   */

  public paginate(): void {

    const start: number = (this.page * this._TAB_MAX_ROWS) - this._TAB_MAX_ROWS;
    const end: number = (start + this._TAB_MAX_ROWS);

    this.transactionLogs = this._cache.slice(start, end);

  }

  /**
   * Apresenta a lista de detalhes de depósito.
   * 
   * @param index - Índice do item no array.
   */

  public listDepositDetails(index: number) {

    const request: ListDepositDetailsRequest = {
        dateTime: this.transactionLogs[index].dateTime,
        nsuTerminal: this.transactionLogs[index].nsuTerminal,
        unitName: this.transactionLogs[index].unitName,
        terminalId: this.transactionLogs[index].terminalId,
        userName: this.transactionLogs[index].userName,
        amount: this.transactionLogs[index].amount
    }

    this.commAreaService.data["listDepositDetailRequest"] = request;

    this.isDepositDetail = true;

  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    this.timeoutService.reset();

    if (this.isDepositDetail) {
        return;
    }

    if (this._ALLOWED_KEYS.indexOf(event.key) === -1) {
        return;
    }

    if (event.key === 'Escape') {
        this.goBack(); return;
    }

    if (event.key === "n" || 
        event.key === "N" || 
        event.key === "ArrowRight") {
        this.nextPage(); return;
    }
    
    if (event.key === "p" || 
        event.key === "P" || 
        event.key === "ArrowLeft") {
        this.previousPage(); return;
    }

    if (event.key === "ArrowUp") {
        this.gotoPage(1); return;
    }

    if (event.key === "ArrowDown") {
      this.gotoPage(this.pages); return;
    }

    this.gotoPage(Number(event.key));

  }

  /**
   * Recebe o evento mousedown do documento.
   */

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: any) {
    this.timeoutService.reset();
  }

  /**
   * Efetiva o recolhimento do numerário.
   */

  public onConfirm(): void {

    const request: CollectCashRequest = {
        groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
        unitId: this.commAreaService.unitId,
        userId: this.commAreaService.user.userId,
        terminalId: this.commAreaService.terminal.terminalId,
        bankNotes: this.bankNotes,
        amount: this.amount
    };

    this.cashCollectionService.collectCash(request).subscribe(
      (response) => {
        this._dateTime = response.data.dateTime;
        this._nsuTerminal = response.data.nsuTerminal;
        this.printReceipt()
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
   * Efetua a impressão do comprovante do recolhimento de numerário.
   */

  private printReceipt(): void {

    const request: PrintCollectCashReceiptRequest = {
      nsuTerminal: this._nsuTerminal,
      terminalId: this.commAreaService.terminal.terminalId,
      companyName: this.commAreaService.userCompany.companyName,
      unitName: this.commAreaService.userUnit.unitName,
      userName: this.commAreaService.userUnit.userName,
      dateTime: this._dateTime,
      amount: this.amount,
      transactionLogs: this._cache
    };

    this.cashCollectionService.printCollectCashReceipt(request).subscribe(
      (response) => {
        this._textDialog.info(messages["cash.collection.success"], this._SHOW_MESSAGE_DELAY, () => {
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
   * Retorna para a tela de menu
   */

  public onCancel(): void {
      this.goBack();
  }

  /**
   * Retorna para a tela de menu
   */

  public goBack() {
      this.router.navigate(['menu']);
  }

  /**
   * Habilita ou desabilita o botão de confirmação.
   */

  public btnConfirmDisabled(): boolean {
    return (this.amount === 0);
  }

  /**
   * Retorna para a tela de login
   */

  public goLoginPage() {
      this.router.navigate(['login']);
  }
 
  /**
   * Efetua o cleanup dos recursos do componente.
   */

  ngOnDestroy(): void {
    this.isDepositDetail = false;
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
