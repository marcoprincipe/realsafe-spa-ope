import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionLog, ListTransactionLogRequest, ListDepositDetailsRequest, GetOpeningDetailRequest, GetClosingDetailRequest, ListCashCollectionDetailsRequest, PrintBankStatementRequest } from '../../payload';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { messages } from 'src/app/messages/AppMessages';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TransactionLogService } from 'src/app/services/transaction-log.service';

declare const $: any;

/**
 * Componente para tratamento do extrato de valores.
 */

@Component({
  selector: 'rs-bank-statement',
  templateUrl: './bank-statement.component.html',
  styleUrls: ['./bank-statement.component.scss'],
  providers: [ TimeoutService ]
})
export class BankStatementComponent implements OnInit, OnDestroy {

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

  public page: number = 1;
  public pages: number = 0;
  public amount: number = 0;
  public bankNotes: number = 0;

  public isDepositDetail: boolean = false;
  public isOpeningDetail: boolean = false;
  public isClosingDetail: boolean = false;
  public isCashCollectionDetail: boolean = false;

  public _cache: Array<TransactionLog> = new Array<TransactionLog>();
  public transactionLogs: Array<TransactionLog> = new Array<TransactionLog>();

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild("bankStatementTextDialog")
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

    this.transactionLogService.listTransactionsByTerminal(request).subscribe(
      (response) => {
        this.showTransactionLogs(response.data.transactionLogs);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  /**
   * Apresenta os logs de transação.
   * 
   * @param transactionLogs - Lista de transações.
   */

  private showTransactionLogs(transactionLogs: Array<TransactionLog>): void {

    this._cache = transactionLogs;

    this.pages = Math.ceil(this._cache.length / this._TAB_MAX_ROWS);

    this.amount = 0;
    this.bankNotes = 0;

    this._cache.filter((item) => {
      return (item.functionalityId === 3 && item.status === "P");
    }).forEach((item) => {
        this.amount += item.amount;
        this.bankNotes += item.bankNotes;
      }
    );

    this.paginate();

    $("#btnBack").focus();

  } 

  /**
   * Imprime o extrato apresentado em tela.
   */

  public doPrintReceipt(): void {

    const request: PrintBankStatementRequest = {
      terminalId: this.commAreaService.terminal.terminalId,
      companyName: this.commAreaService.userUnit.companyName,
      unitName: this.commAreaService.userUnit.unitName,
      userName: this.commAreaService.userUnit.userName,
      transactionLogs: this._cache
    };

    this.transactionLogService.printBankStatement(request).subscribe(
      (response) => {
        this._textDialog.info(messages["printing.bank.statement.success"], this._SHOW_MESSAGE_DELAY, () => {
          this.setFocus("btnBack");
        });
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnBack");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("btnBack");
          });
        }
      }
    );

  }

  /**
   * Habilita ou desabilita o botão de impressão.
   */

  public disablePrintButton(): boolean {

    return this._cache.length === 0;

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
   * Apresenta os dados do detalhe da abertura do terminal.
   * 
   * @param index - Índice do item no array.
   */

  public getOpeningDetail(index : number) {

    const request: GetOpeningDetailRequest = {
      dateTime: this.transactionLogs[index].dateTime,
      nsuTerminal: this.transactionLogs[index].nsuTerminal,
      unitName: this.transactionLogs[index].unitName,
      terminalId: this.transactionLogs[index].terminalId,
      userName: this.transactionLogs[index].userName,
  }

    this.commAreaService.data["getOpeningDetailRequest"] = request;

    this.isOpeningDetail = true;

  }

  /**
   * Apresenta os dados do detalhe do fechamento do terminal.
   * 
   * @param index - Índice do item no array.
   */

  public getClosingDetail(index : number) {

    const request: GetClosingDetailRequest = {
      dateTime: this.transactionLogs[index].dateTime,
      nsuTerminal: this.transactionLogs[index].nsuTerminal,
      unitName: this.transactionLogs[index].unitName,
      terminalId: this.transactionLogs[index].terminalId,
      userName: this.transactionLogs[index].userName,
  }

    this.commAreaService.data["getClosingDetailRequest"] = request;

    this.isClosingDetail = true;

  }

  /**
   * Apresenta a lista de detalhes de depósito.
   * 
   * @param index - Índice do item no array.
   */

  public listCashCollectionDetails(index: number) {

    const request: ListCashCollectionDetailsRequest = {
        dateTime: this.transactionLogs[index].dateTime,
        unitName: this.transactionLogs[index].unitName,
        terminalId: this.transactionLogs[index].terminalId,
        userName: this.transactionLogs[index].userName,
        cashCollectionNsu: this.transactionLogs[index].nsuTerminal,
        bankNotes: this.transactionLogs[index].bankNotes,
        amount: this.transactionLogs[index].amount
    }

    this.commAreaService.data["listCashCollectionDetails"] = request;

    this.isCashCollectionDetail = true;

  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    this.timeoutService.reset();

    if (this.isCashCollectionDetail) {
      return;
  }

    if (this._ALLOWED_KEYS.indexOf(event.key) === -1) {
        return;
    }

    if (event.key === 'Escape') {
      if (!this.isOpeningDetail && !this.isClosingDetail && 
          !this.isDepositDetail && !this.isCashCollectionDetail) {
          this.goBack();
      }
      return;
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
   * Retorna para a tela de menu
   */

  public goBack() {

      this.router.navigate(['menu']);
      
  }

  /**
   * Retorna para a tela de login
   */

  public goLoginPage() {

    setTimeout(()=> {
      this.router.navigate(['login']);
    }, 250);

  }
 
  /**
   * Efetua o cleanup dos recursos do componente.
   */

  ngOnDestroy(): void {

    this.isDepositDetail = false;
    this.isOpeningDetail = false;
    this.isClosingDetail = false;
    this.isCashCollectionDetail = false;

    this.timeoutService.stop();

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
