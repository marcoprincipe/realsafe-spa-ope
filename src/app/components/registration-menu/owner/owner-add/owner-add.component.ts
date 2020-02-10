import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { Formatter } from 'src/app/shared/formatters';
import { KeyboardComponent } from '../../../keyboard/keyboard.component';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { OwnerService } from 'src/app/services/owner.service';

declare const $: any;

@Component({
  selector: 'rs-owner-add',
  templateUrl: './owner-add.component.html',
  styleUrls: ['./owner-add.component.scss']
})
export class OwnerAddComponent implements OnInit {

  public frmAddOwner: FormGroup;
  //public owner: OwnerRequest;

  submitted = false;

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

  public useVK: boolean = true;
  public message: string;

 /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param formBuilder
   * @param appConfigService - Instância do serviço de configurações.
   * @param ownerService - Instância do serviço de proprietários.
   */

  constructor(    
    private router: Router,
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    private ownerService: OwnerService) { 

    }

  ngOnInit() {

    this.message = null;
  
    this.useVK = this.appConfigService.useVK;

    this.frmAddOwner = this.formBuilder.group({
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
      contact: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber:['', Validators.required],      
      cellphoneNumber:['', Validators.required],
      additionalInfo: '',
      status: ''
    })
  }

  // convenience getter for easy access to form fields
  get f() { 
    return this.frmAddOwner.controls; 
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
      this.frmAddOwner[`${event.fieldId}`] = Formatter.cnpj(Formatter.padLeft(event.value, "0", 14));
    }
    else {
      this.frmAddOwner[`${event.fieldId}`] = event.value;
    }
    
    $(`#${event.fieldId}`).focus();
  }


  /**
   * Recebe os dados digitados no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onCancelClicked(event: any) {
    this.frmAddOwner[`${event.fieldId}`] = event.value;
    $(`#${event.fieldId}`).focus();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.frmAddOwner.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.frmAddOwner.value, null, 4));
/*
    this.company = this.frmAddCompany.value

    console.log(this.company);

    this.message = null;

    this.companyService.addCompany(this.company).subscribe(
      (response) => {
        this._textDialog.info(messages["company.create.success"], this._SHOW_MESSAGE_DELAY, () => {
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
  */
  } 

  public onReset() {
    this.submitted = false;
    this.frmAddOwner.reset();
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

}
