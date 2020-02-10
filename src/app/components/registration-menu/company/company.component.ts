import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { messages } from 'src/app/messages/AppMessages';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { ListUserGroupsRequest, UserGroup, GroupOwner } from 'src/app/payload';
import { CompanyAddComponent } from '../company/company-add/company-add.component';
import { CompanyDetailComponent } from '../company/company-detail/company-detail.component';
import { ListCompanyDetailsRequest, SearchCompaniesRequest, SearchCompaniesResponse } from 'src/app/payload';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { GroupOwnerService } from 'src/app/services/group-owner.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  groupOwnerId: string,
  groupId: string
}

/**
 * Componente para cadastro de empresas.
 */

@Component({
  selector: 'rs-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  providers: [ TimeoutService ]
})
export class CompanyComponent implements OnInit {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;
  
    /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    groupOwnerId: "",
    groupId: ""
  };
  
  public userGroups: Array<UserGroup> = new Array<UserGroup>();
  public groupOwners: Array<GroupOwner> = new Array<GroupOwner>();

  public companies: SearchCompaniesResponse = {
    companyId: 0,
    companyName: "",
    contactName: "",
    phoneNumber: 0
  };


  private groupOwnerIndex: number = -1;
  private groupIndex: number = -1;

  public isCompanyDetail: boolean = false;
  public isCompanyAdd: boolean = false;
  
  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  @ViewChild(CompanyDetailComponent)
  private _companyDetailComponent: CompanyDetailComponent;

  @ViewChild(CompanyAddComponent)
  private _companyAddComponent: CompanyAddComponent;

  @Input()
  public visible: boolean = false;


  public message: string;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param userService - Instância do serviço de usuários.
   * @param companyService - Instância do serviço de empresas.
   * @param groupOwnerService - Instância do serviço de proprietário de grupo. 
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private commAreaService: CommAreaService,
    private userService: UserService,
    private companyService: CompanyService,
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
   * Recebe o evento change do combo de grupos.
   * 
   * @param event - Interface com os dados do evento.
   */

  public onGroupChange(event: any) {

    this.groupIndex = event.target.selectedIndex;

    if (event.target.value === "") {
        return;
    }

  }

  /**
   * Efetua a pesquisa das empresas.
   */

  public searchCompanies(): void {

    this.companies = null;

    const request: SearchCompaniesRequest = {
      //groupOwnerId: Number(this.form.groupOwnerId),
      groupId: Number(this.form.groupId)
    };

    this.message = null;

    this.companyService.searchCompanies(request).subscribe(
      (response) => {
        this.companies = response.data;
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("groupId");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("groupId");
          });
        }
      }
    );

  }

  /**
   * Apresenta a lista de detalhes da empresa.
   * 
   * @param index - Índice da empresa no array.
   */

  public viewCompany(index: number) {

   const request: ListCompanyDetailsRequest = {
      companyId: this.companies[index].companyId
    }

    this.commAreaService.data["listCompanyDetailsRequest"] = request;
   
    this.timeoutService.stop();
    this.isCompanyDetail = true;
    this._companyDetailComponent.show;
  } 
   
  /**
   * Adiciona um empresa.
   * 
   */

  public addCompany() {

     this.timeoutService.stop();
     this.isCompanyAdd = true;
     this._companyAddComponent.show;
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
}


