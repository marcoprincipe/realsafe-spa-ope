import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { ListUserGroupsRequest, UserGroup, ListUserCompaniesRequest, UserCompany, UserUnit, ListUserUnitsRequest } from '../../payload';
import { messages } from 'src/app/messages/AppMessages';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { UserService } from 'src/app/services/user.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  groupId: string,
  companyId: string,
  unitId: string
}

/**
 * Componente para acesso a aplicação.
 */

@Component({
  selector: 'rs-access-menu',
  templateUrl: './access-menu.component.html',
  styleUrls: ['./access-menu.component.scss'],
  providers: [ TimeoutService ]
})
export class AccessMenuComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;

  /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    groupId: "",
    companyId: "",
    unitId: ""
  };

  public userGroups: Array<UserGroup> = new Array<UserGroup>();
  public userCompanies: Array<UserCompany> = new Array<UserCompany>();
  public userUnits: Array<UserUnit> = new Array<UserUnit>();

  private groupIndex: number = -1;
  private companyIndex: number = -1;
  private unitIndex: number = -1;

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  public message: string;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do serviço de navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param userService - Instância do serviço de usuários.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private commAreaService: CommAreaService,
    private userService: UserService,
    private timeoutService: TimeoutService) {
  };

  /**
   * Inicializa o componente para utilização.
   */

   ngOnInit(): void {

    this.timeoutService.onTimeout(() => {
      this.goBack();
    });

    this.loadGroups();

    setTimeout(() => {
      $("#groupId").focus();
    }, 100);

  }

  /**
   * Efetua a carga do combo de grupos.
   */

  private loadGroups(): void {

    this.userGroups = [];
    
    const request: ListUserGroupsRequest = {
      groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
      userId: this.commAreaService.user.userId
    };

    this.userService.listUserGroups(request).subscribe(
      (response) => {
        this.userGroups = response.data.userGroups;
        if (this.userGroups.length === 1) {
            this.form.groupId = String(this.userGroups[0].groupId);
            this.groupIndex = 1;
            this.loadCompanies();
        }
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("userId");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("userId");
          });
        }
      });

  }

  /**
   * Recebe o evento change do combo de grupos.
   * 
   * @param event - Interface com os dados do evento.
   */

  public onGroupChange(event: any) {

    this.form.companyId = "";
    this.form.unitId = "";

    this.userCompanies = [];
    this.userUnits = [];

    this.groupIndex = event.target.selectedIndex;
    this.companyIndex = -1;
    this.unitIndex = -1;

    if (event.target.value === "") {
        return;
    }

    this.loadCompanies();

  }

  /**
   * Efetua a carga do combo de empresas.
   */

  private loadCompanies(): void {

    const request: ListUserCompaniesRequest = {
      groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
      groupId: Number(this.form.groupId),
      userId: this.commAreaService.user.userId
    };

    this.userService.listUserCompanies(request).subscribe(
      (response) => {
        this.userCompanies = response.data.userCompanies;
        if (this.userCompanies.length === 1) {
            this.form.companyId = String(this.userCompanies[0].companyId);
            this.companyIndex = 1;
            this.loadUnits();
        }
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("userId");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("userId");
          });
        }
      });

  }

  /**
   * Recebe o evento change do combo de empresas.
   * 
   * @param event - Interface com os dados do evento.
   */

  public onCompanyChange(event: any) {

    this.form.unitId = "";
    this.userUnits = [];

    this.companyIndex = event.target.selectedIndex;
    this.unitIndex = -1;

    if (event.target.value === "") {
        return;
    }

    this.loadUnits();

  }

  /**
   * Efetua a carga do combo de unidades.
   */

  private loadUnits(): void {

    const request: ListUserUnitsRequest = {
      groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
      groupId: Number(this.form.groupId),
      companyId: Number(this.form.companyId),
      userId: this.commAreaService.user.userId
    };

    this.userService.listUserUnits(request).subscribe(
      (response) => {
        this.userUnits = response.data.userUnits;
        if (this.userUnits.length === 1) {
            this.form.unitId = String(this.userUnits[0].unitId);
            this.unitIndex = 1;
            this.setFocus("btnConfirm");
        }
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("userId");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("userId");
          });
        }
      });

  }

  /**
   * Recebe o evento change do combo de unidades.
   * 
   * @param event - Interface com os dados do evento.
   */

  public onUnitChange(event: any) {

    this.unitIndex = event.target.selectedIndex;

    if (event.target.value === "") {
        return;
    }

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

  /**
   * Recebe o evento click do botão confirmar.
   */

  public onConfirm(): void {

    this.commAreaService.isUnique = false;

    if (this.userGroups.length === 1 && 
        this.userCompanies.length === 1 &&
        this.userUnits.length === 1) {
        this.commAreaService.isUnique = true;
    }

    this.commAreaService.groupId = Number(this.form.groupId);
    this.commAreaService.companyId = Number(this.form.companyId);
    this.commAreaService.unitId = Number(this.form.unitId);

    this.commAreaService.userGroup = this.userGroups[this.groupIndex - 1];
    this.commAreaService.userCompany = this.userCompanies[this.companyIndex - 1];
    this.commAreaService.userUnit = this.userUnits[this.unitIndex - 1];

    this.router.navigate(['menu']);

  }

  /**
   * Recebe o evento click do botão cancelar.
   */

  public onCancel(): void {

    this.goBack();

  }

  /**
   * Habilita ou desabilita o botão de envio.
   */

  public disableConfirmButton(): boolean {

    return  this.form.groupId === "" ||
            this.form.companyId === "" ||
            this.form.unitId === "";

  }


  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    if (event.key === 'Escape') {
        this.goBack();
    }

    this.timeoutService.reset();

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
   * Efetua o cleanup dos recursos do componente.
   */

  ngOnDestroy(): void {

    this.timeoutService.stop();

  }

}
