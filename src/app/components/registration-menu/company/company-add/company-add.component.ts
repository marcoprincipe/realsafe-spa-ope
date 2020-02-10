import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { messages } from 'src/app/messages/AppMessages';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { Formatter } from 'src/app/shared/formatters';
import { KeyboardComponent } from '../../../keyboard/keyboard.component';
import { CompanyRequest, GroupOwner, UserGroup, ListUserGroupsRequest } from 'src/app/payload';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { UserService } from 'src/app/services/user.service';
import { GroupOwnerService } from 'src/app/services/group-owner.service';
import { CompanyService } from 'src/app/services/company.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  companyName: string
}

/**
 * Diálogo para inclusão de uma empresa.
 */

@Component({
  selector: 'rs-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.scss'],
  providers: [ TimeoutService ]
})
export class CompanyAddComponent implements OnInit {
  
  public frmAddCompany: FormGroup;
  public company: CompanyRequest;

  public isCompanyAdd: boolean = false;

  public submitted = false;

   /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;


    /**
   * Instância do teclado virtual.
   */

  @ViewChild(KeyboardComponent)
  private _keyboardComponent: KeyboardComponent;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  @Input()
  public visible: boolean = false;

  @Output()
  public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  /**
   * Declaração das variáveis membro.
   */

  private today: Date;
  
  public useVK: boolean = true;
  public message: string;

  public userGroups: Array<UserGroup> = new Array<UserGroup>();
  public groupOwners: Array<GroupOwner> = new Array<GroupOwner>();

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param formBuilder - 
   * @param appConfigService - Instância do serviço de configurações.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param userService - Instância do serviço de usuários.
   * @param groupOwnerService - Instância do serviço de proprietário de grupo. 
   * @param companyService - Instância do serviço de empresas.
   * @param timeoutService - Instância do serviço de timeout.
   */
  constructor(    
    private router: Router,
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    private commAreaService: CommAreaService,
    private userService: UserService,
    private groupOwnerService: GroupOwnerService,
    private companyService: CompanyService,
    private timeoutService: TimeoutService) { 

  };

  /**
   * Inicializa o componente para utilização.
   */

  public ngOnInit(): void {

    this.timeoutService.onTimeout(() => {
      this.goLoginPage();
    });

    this.show();

    this.createForm();

    this.message = null;

    this.useVK = this.appConfigService.useVK;

    this.frmAddCompany = this.formBuilder.group({
      groupOwnerId: ['', Validators.required],
      groupId: ['', Validators.required],
      companyName: ['', Validators.required],
      businessName: ['', Validators.required],
      companyId: ['', Validators.required],
      address: ['', Validators.required],
      addressComplement: ['', Validators.required],
      addressNeighborhood: ['', Validators.required],
      cityName: ['', Validators.required],
      stateCode: ['', Validators.required],
      siteAddress: ['', Validators.required],
      contactName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber:['', Validators.required],      
      cellphoneNumber:['', Validators.required],
      additionalInfo: '',
      status: 'A'
    });

    this.frmAddCompany.get('groupId').setValue(null);
    this.frmAddCompany.controls['groupId'].disable();

    this.loadGroupOwners();
  }

     /**
     *  Efetua a cruiação dos forms do componente
     */
    createForm() {

      this.frmAddCompany = this.formBuilder.group({
        groupOwnerId: new FormControl(null),
        groupId: new FormControl(null),
        companyName: new FormControl(null),
        businessName: new FormControl(null),
        companyId: new FormControl(null),
        address: new FormControl(null),
        addressComplement: new FormControl(null),
        addressNeighborhood: new FormControl(null),
        cityName: new FormControl(null),
        stateCode: new FormControl(null),
        siteAddress: new FormControl(null),
        contactName: new FormControl(null),
        emailAddress: new FormControl(null),
        phoneNumber: new FormControl(null),     
        cellphoneNumber: new FormControl(null),
        additionalInfo: new FormControl(null),
        status: new FormControl(null)
      });
      
    }

  /**
   * Efetua a carga do combo de proprietários.
   */

  private loadGroupOwners(): void {
     
    this.groupOwners = [];

     this.groupOwnerService.listGroupOwner().subscribe(
      (response) => {
        this.groupOwners = response.data.groupOwners;
        //if (this.groupOwners.length === 1) {
        //  this.form.groupOwnerId = String(this.groupOwners[0].groupOwnerId);
        //  this.groupOwnerIndex = 1;
        //  this.loadGroups();
        //}
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
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

    //this.form.groupId = "";

    this.userGroups = [];

    //this.groupOwnerIndex = event.target.selectedIndex;
    //this.groupIndex = -1
    
    if (event.target.value === "") {
        return;
    }
    this.frmAddCompany.controls['groupId'].enable();
    this.loadGroups();

  }


  /**
   * Efetua a carga do combo de grupos.
   */
  private loadGroups(): void {

    this.userGroups = [];

    const request: ListUserGroupsRequest = {
      groupOwnerId: Number(this.frmAddCompany.controls['groupOwnerId'].value),
      userId: this.commAreaService.user.userId
    };

    this.userService.listUserGroups(request).subscribe(
      (response) => {
        this.userGroups = response.data.userGroups;
        //if (this.userGroups.length === 1) {
        //    this.form.groupId = String(this.userGroups[0].groupId);
        //    this.groupIndex = 1;
        //    this.setFocus("btnSearch");
        //}
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
          });
        }
      });

  }

     
    // convenience getter for easy access to form fields
    get f() { 
      return this.frmAddCompany.controls; 
    }

  /**
   * Apresenta o teclado virtual.
   * 
   * @param params - Parâmetros a serem passados para o teclado virtual.
   */

  public showKeyboard(params: any) {

    if (this.useVK) {
        const value: string = $(`#${params.fieldId}`).val();
        this._keyboardComponent.show({ 
        "fieldId": params.fieldId, 
        "value": Formatter.unFormat(value) || "", 
        "isPassword": params.isPassword || false, 
        "isNumeric": params.isNumeric || false, 
        "maxLength": params.maxLength || 0,
        "kbType": params.kbType || "alpha" });
    }
  
  }

  /**
   * Recebe os dados digitados no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onEnterClicked(event: any) {
    if (event.fieldId === "companyId") {
      this.frmAddCompany.get(`${event.fieldId}`).setValue(Formatter.cnpj(Formatter.padLeft(event.value, "0", 14)));
    }
    else {
      this.frmAddCompany.get(`${event.fieldId}`).setValue(event.value);
    }
    
    $(`#${event.fieldId}`).focus();
  }


  /**
   * Recebe os dados digitados no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onCancelClicked(event: any) {
    this.frmAddCompany[`${event.fieldId}`] = event.value;
    $(`#${event.fieldId}`).focus();
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
   * Recebe o evento mousedown do documento.
   */

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: any) {
    this.timeoutService.reset();
  }

  /**
   * Efetua a a inclusão de uma empresa.
   */

  public onSubmit(): void {

    this.submitted = true;

 //   if (this.frmAddCompany.invalid) {
 //       return;
 //   }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.frmAddCompany.value, null, 4));

    this.company = this.frmAddCompany.value

    console.log(this.company);

    this.message = null;

    this.companyService.addCompany(this.company).subscribe(
      (response) => {
        this._textDialog.info(messages["company.create.success"], this._SHOW_MESSAGE_DELAY, () => {
        this.onReset();
        })
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

      }
    );
  } 

  /**
   * Retorna para a tela de login
   */

  public goLoginPage() {

    this.router.navigate(['login']);
  }


  /**
   * Apresenta o diálogo para inclusao de uma empresa.
   */

  public show(): void {

    $("#companyAddDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
          $("#btnExit").trigger('focus')
        }, 100);
    })

    $("#companyAddDialog").modal({ backdrop: 'static', keyboard: true });

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#companyAddDialog").modal('hide');

    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  public onReset() {

    this.submitted = false;
    this.frmAddCompany.reset();
  } 

  /**
   * Efetua o cleanup dos recursos do componente.
   */

  ngOnDestroy(): void {

    this.isCompanyAdd = false;

    this.timeoutService.stop();
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

    this.router.navigate(['company-registration']);
  }

}
