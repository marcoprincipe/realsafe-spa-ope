
import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { messages } from 'src/app/messages/AppMessages';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { ListUserGroupsRequest, ListUserCompaniesRequest, UserGroup, UserCompany, GroupOwner } from '../../../payload';
import { UnitDetailComponent } from '../unit/unit-detail/unit-detail.component';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { UserService } from 'src/app/services/user.service';
import { GroupOwnerService } from 'src/app/services/group-owner.service';


declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  groupOwnerId: string,
  groupId: string,
  companyId: string
}

/**
 * Componente para cadastro de grupos.
 */

@Component({
  selector: 'rs-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
  providers: [ TimeoutService ]
})
export class UnitComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;
  
    /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    groupOwnerId: "",
    groupId: "",
    companyId: ""
  };
  
  public userGroups: Array<UserGroup> = new Array<UserGroup>();
  public userCompanies: Array<UserCompany> = new Array<UserCompany>();
  public groupOwners: Array<GroupOwner> = new Array<GroupOwner>();

  private groupIndex: number = -1;
  private companyIndex: number = -1;
  private groupOwnerIndex: number = -1;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  @ViewChild(UnitDetailComponent)
  private _unitDetailComponent: UnitDetailComponent;

  public message: string;
  
  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param userService - Instância do serviço de usuários.
   * @param groupOwnerService - Instância do serviço de proprietário de grupo. 
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private commAreaService: CommAreaService,
    private userService: UserService,
    private groupOwnerService: GroupOwnerService,
    private timeoutService: TimeoutService) {
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit(): void {

    this.timeoutService.onTimeout(() => {
      this.goBack();
    });

    this.message = null;  
    
    this.loadGroupOwners(); 

    setTimeout(() => {
      $("#groupOwnerId").focus();
    }, 100);

  }

  /**
   * Efetua a carga do combo de proprietários.
   */

  private loadGroupOwners(): void {
     
    this.groupOwners = [];

     this.groupOwnerService.listGroupOwner().subscribe(
      (response) => {
        this.groupOwners = response.data.groupOwners;
        if (this.groupOwners.length === 1) {
          this.form.groupOwnerId = String(this.groupOwners[0].groupOwnerId);
          this.groupOwnerIndex = 1;
          this.loadGroups();
        }
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("companyName");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
          this.setFocus("companyName");
          });
        }

       });
}

  /**
   * Recebe o evento change do combo de empresas.
   * 
   * @param event - Interface com os dados do evento.
   */

  public onOwnerChange(event: any) {

    this.form.groupId = "";

    this.userGroups = [];

    this.groupOwnerIndex = event.target.selectedIndex;
    this.groupIndex = -1
    
    if (event.target.value === "") {
        return;
    }

    this.loadGroups();

  }

  /**
   * Efetua a carga do combo de grupos.
   */

  private loadGroups(): void {

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

    this.userCompanies = [];

    this.groupIndex = event.target.selectedIndex;
    this.companyIndex = -1;
    
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
      groupId: Number(this.form.groupId),
      userId: this.commAreaService.user.userId
    };

    this.userService.listUserCompanies(request).subscribe(
      (response) => {
        this.userCompanies = response.data.userCompanies;
        if (this.userCompanies.length === 1) {
            this.form.companyId = String(this.userCompanies[0].companyId);
            this.companyIndex = 1;
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

    this.companyIndex = event.target.selectedIndex;

    if (event.target.value === "") {
        return;
    }

  }

  public viewUnit(index: number) {

    //  const request: ListUnitDetailsRequest = {
    //    unitId: this.units[index].unitId
    //  }
  
    //  this.commAreaService.data["listUnitDetailsRequest"] = request;
  
    //  this._unitDetailComponent.show();
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
   * Apresenta o diálogo de confirmação.
   */

  public show(): void {

    $('#unitDetailDialog').on('shown.bs.modal', function () {
      $('#btnYes').trigger('focus')
    })

    $("#unitDetailDialog").modal({ backdrop: 'static', keyboard: false });

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {
    $("#unitDetailDialog").modal('hide');
    }
  }
