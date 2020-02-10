
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { messages } from 'src/app/messages/AppMessages';
import { OwnerDetail }  from 'src/app/model';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { ListUserGroupsRequest, ListUserUnitsRequest, ListUserCompaniesRequest, UserGroup, UserCompany, UserUnit, SearchGroupOwnerRequest, ListGroupOwnerRequest, GroupOwner, SearchGroupOwnerResponse } from '../../../payload';
import { OwnerDetailComponent } from '../owner/owner-detail/owner-detail.component';
import { ListGroupOwnerDetailsRequest } from '../../../payload/group-owner-details/list-group-owner-details-request';
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
  companyId: string,
  unitId: string
}

/**
 * Componente para cadastro de proprietários.
 */

@Component({
  selector: 'rs-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss'],
  providers: [ TimeoutService ]
})
export class OwnerComponent implements OnInit, OnDestroy {

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
    companyId: "",
    unitId: ""
  };

  
  public userGroups: Array<UserGroup> = new Array<UserGroup>();
  public userCompanies: Array<UserCompany> = new Array<UserCompany>();
  public userUnits: Array<UserUnit> = new Array<UserUnit>();
  public groupOwners: Array<GroupOwner> = new Array<GroupOwner>();

  public groupOwnersDetails: OwnerDetail[];
  public groupOwners2: SearchGroupOwnerResponse[];

  private groupOwnerIndex: number = -1;
  private groupIndex: number = -1;
  private companyIndex: number = -1;
  private unitIndex: number = -1;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  @ViewChild(OwnerDetailComponent)
  private _ownerDetailComponent: OwnerDetailComponent;

  public message: string;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param userService - Instância do serviço de usuários.
   * @param groupOwnerService - Instância do service de proprietário de grupo.
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
   this.form.companyId = "";
   this.form.unitId = "";

   this.userGroups = [];
   this.userCompanies = [];
   this.userUnits = [];

   this.groupOwnerIndex = event.target.selectedIndex;
   this.groupIndex = -1
   this.companyIndex = -1;
   this.unitIndex = -1;

   if (event.target.value === "") {
       return;
   }

   this.loadGroups();

 }
 
  /**
   * Efetua a carga do combo de grupos.
   */

  private loadGroups(): void {

    this.userGroups = [];

    const request: ListUserGroupsRequest = {
      groupOwnerId: Number(this.form.groupOwnerId),
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

    this.userCompanies = [];

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

    this.userUnits = [];

    const request: ListUserUnitsRequest = {
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
            this.setFocus("btnSearch");
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
   * Efetua a pesquisa de proprietário de grupo.
   */

  public searchGroupOwners(): void {

    const request: SearchGroupOwnerRequest = {
      groupOwnerId: Number(this.form.groupOwnerId),
      groupId: Number(this.form.groupId),
      companyId: Number(this.form.companyId),
      unitId: Number(this.form.unitId)
    };

    this.message = null;

    this.groupOwnerService.searchGroupOwners(request).subscribe(
      (response) => {
        this.groupOwners2 = response.data;
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("groupOwnerId");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("groupOwnerId");
          });
        }
      }
    );

  }

  /**
   * Apresenta a lista de detalhes do proprietario.
   * 
   * @param index - Índice do proprietario no  array.
   */

  public viewGroupOwnerDetails(index: number) {

      const request: ListGroupOwnerDetailsRequest = {
        groupOwnerId: this.groupOwnersDetails[index].groupOwnerId
      }
  
      this.commAreaService.data["listGroupOwnerDetailsRequest"] = request;
  
      this._ownerDetailComponent.show();
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

    $('#ownerDetailDialog').on('shown.bs.modal', function () {
      $('#btnYes').trigger('focus')
    })

    $("#ownerDetailDialog").modal({ backdrop: 'static', keyboard: false });

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {
    $("#ownerDetailDialog").modal('hide');
    }
  }






