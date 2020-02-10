
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { messages } from 'src/app/messages/AppMessages';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { GroupOwner } from '../../../payload';
import { GroupDetailComponent } from '../group/group-detail/group-detail.component';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { GroupOwnerService } from 'src/app/services/group-owner.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  groupOwnerId: string
}

/**
 * Componente para cadastro de grupos.
 */

@Component({
  selector: 'rs-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  providers: [ TimeoutService ]
})
export class GroupComponent implements OnInit, OnDestroy {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;
  
    /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    groupOwnerId: ""
  };

  public groupOwners: Array<GroupOwner> = new Array<GroupOwner>();

  private groupOwnerIndex: number = -1;

  /**
   * Instância do diálogo de texto.
   */

  @ViewChild(TextDialogComponent)
  private _textDialog: TextDialogComponent;

  @ViewChild(GroupDetailComponent)
  private _groupDetailComponent: GroupDetailComponent;

  public message: string;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param groupOwnerService - Instância do serviço de proprietário de grupo. 
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private commAreaService: CommAreaService,
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
          this.setFocus("btnSearch");
        }
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("groupOwnerName");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
          this.setFocus("groupOwnerName");
          });
        }

       });
}

  /**
   * Recebe o evento change do combo de proprietario.
   * 
   * @param event - Interface com os dados do evento.
   */

  public onOwnerChange(event: any) {

    this.groupOwners = [];

    this.groupOwnerIndex = event.target.selectedIndex;
    
    if (event.target.value === "") {
        return;
    }

  }



  public viewGroup(index: number) {

    //  const request: ListGroupDetailsRequest = {
    //    groupId: this.groups[index].groupId
    //  }
  
    //  this.commAreaService.data["listGroupDetailsRequest"] = request;
  
    //  this._groupDetailComponent.show();
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

    $('#groupDetailDialog').on('shown.bs.modal', function () {
      $('#btnYes').trigger('focus')
    })

    $("#groupDetailDialog").modal({ backdrop: 'static', keyboard: false });

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {
    $("#groupDetailDialog").modal('hide');
    }
  }
