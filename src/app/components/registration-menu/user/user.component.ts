
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';

declare const $: any;

/**
 * Componente para cadastro de usuários.
 */

@Component({
  selector: 'rs-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ TimeoutService ]
})
export class UserComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes da classe
   */

  private readonly _TAB_MAX_ROWS: number = 14;
  private readonly _ALLOWED_KEYS: string[] = 
        ["0", "1", "2", "3",  "4", "5", "6", "7", "8", "9", 
         "n", "N", "p", "P", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Escape"];

  /**
   * Declaração das variáveis membro.
   */

  public page: number = 1;
  public pages: number = 0;
  public total: number = 0;

//  public _cache: Array<TransactionLog>;
//  public transactionLogs: Array<TransactionLog>;

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
    private timeoutService: TimeoutService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    this.timeoutService.onTimeout(() => {
      this.goBack();
    });
  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    this.timeoutService.reset();

    if (this._ALLOWED_KEYS.indexOf(event.key) === -1) {
        return;
    }

    if (event.key === 'Escape') {
        this.goBack(); return;
    }

    if (event.key === "n" || 
        event.key === "N" || 
        event.key === "ArrowRight") {
    //    this.nextPage(); return;
    }
    
    if (event.key === "p" || 
        event.key === "P" || 
        event.key === "ArrowLeft") {
    //    this.previousPage(); return;
    }

    if (event.key === "ArrowUp") {
    //    this.gotoPage(1); return;
    }

    if (event.key === "ArrowDown") {
    //  this.gotoPage(this.pages); return;
    }

    //this.gotoPage(Number(event.key));

  }

  /**
   * Recebe o evento click do botão cancelar.
   */

  public onCancel(): void {
    this.goBack();

  }

  /**
   * Retorna para a tela de menu
   */

  public goBack() {
    this.router.navigate(['registration-menu']);
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

    this.timeoutService.stop();

  }
 
}


