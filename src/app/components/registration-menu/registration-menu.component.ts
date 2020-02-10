import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FunctionalityRole } from 'src/app/payload';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router, ActivatedRoute } from '@angular/router';
import { messages } from 'src/app/messages/AppMessages';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { FunctionalityService } from 'src/app/services/functionality.service';

declare const $: any;

@Component({
  selector: 'rs-registration-menu',
  templateUrl: './registration-menu.component.html',
  styleUrls: ['./registration-menu.component.scss'],
  providers: [ TimeoutService ]
})
export class RegistrationMenuComponent implements OnInit, OnDestroy {

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

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param functionalityService - Instância do serviço de funcionalidades.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commareaService: CommAreaService,
    private functionalityService: FunctionalityService,
    private timeoutService: TimeoutService) { 
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    this.timeoutService.onTimeout(() => {
      this.goLogin();
    });

    this.setFocus("opcao01");

    const parentId: number = this.activatedRoute.snapshot.data.parentId;
    const roleId: number = this.commareaService.userUnit.roleId;

    this.functionalityService.listFunctionalitiesByRoleId(roleId, parentId).subscribe(
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
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    if (event.key === 'Escape') {
        if (this.commareaService.isUnique) {
            this.goBack();          
        }
        else {
            this.navigateTo('menu');
        }
    }

    this.timeoutService.reset();

    if (event.key === 'Enter') {
        return;
    }

    const route: string = this.findRouteByAccessKey(event.key);

    if (route) {
        this.navigateTo(route);
    }

  }

  /**
   * Pesquisa pela rota a partir da ordem informada.
   * 
   * @param accessKey - Tecla de acesso a ser pesquisada.
   */

  private findRouteByAccessKey(accessKey: string): string {

    const result: FunctionalityRole[] = this.functionalitiesRole.filter((item) => {
        return item.functionalityAccessKey === accessKey;
    })

    if (result && result.length > 0) {
        return result[0].functionalityRoute;
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

  public goLogin(): void {
    this.navigateTo('login');
  }

  /**
   * Volta para a tela de menu.
   */

  public goBack(): void {
    this.navigateTo('menu');
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

    this.timeoutService.stop();

  }
  
}
