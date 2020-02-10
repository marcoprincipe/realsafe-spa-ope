import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { Formatter } from 'src/app/shared/formatters';
import { KeyboardComponent } from '../../../keyboard/keyboard.component';
import { TerminalRequest } from 'src/app/payload';
import { AppConfigService } from 'src/app/shared/services/app-config.service';

declare const $: any;

@Component({
  selector: 'rs-terminal-add',
  templateUrl: './terminal-add.component.html',
  styleUrls: ['./terminal-add.component.scss']
})
export class TerminalAddComponent implements OnInit {

  public frmAddTerminal: FormGroup;
  public terminal: TerminalRequest;

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

  /**
   * Declaração das variáveis membro.
   */

  private today: Date;
  public groupId: number;

  public useVK: boolean = true;
  public message: string;

  /**
   * Construtor default da classe.
   * 
   * @param router - Instância do objeto para navegação.
   * @param formBuilder
   * @param appConfigService - Instância do serviço de configurações.
   * @param terminalService - Instância do serviço de terminais.
   */
  constructor(    
      private router: Router,
      private formBuilder: FormBuilder,
      private appConfigService: AppConfigService) {
    }

  ngOnInit() {

    this.message = null;
  
    this.useVK = this.appConfigService.useVK;
    
    this.frmAddTerminal = this.formBuilder.group({
      terminalId:['', Validators.required],
      userName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      cellPhoneNumber:['', Validators.required],
      creationDate: ['', Validators.required],
      groupOwnerId: ['', Validators.required],
      groupId: ['', Validators.required],
      companyName: ['', Validators.required],
      unitName: ['', Validators.required],
      additionalInfo: '',
      status: ''
    })
  }

     
    // convenience getter for easy access to form fields
    get f() { 
      return this.frmAddTerminal.controls; 
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

    this.frmAddTerminal[`${event.fieldId}`] = event.value;
    
    $(`#${event.fieldId}`).focus();
  }


  /**
   * Recebe os dados digitados no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onCancelClicked(event: any) {
    this.frmAddTerminal[`${event.fieldId}`] = event.value;
    $(`#${event.fieldId}`).focus();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.frmAddTerminal.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.frmAddTerminal.value, null, 4));
/*
    this.terminal = this.frmAddTerminal.value

    console.log(this.terminal);

    this.message = null;

    this.terminalService.addTerminal(this.terminal).subscribe(
      (response) => {
        this._textDialog.info(messages["terminal.create.success"], this._SHOW_MESSAGE_DELAY, () => {
        })
      },
      (error) => {
        if (error.status === 400) {
          this._textDialog.error(error.error.message, this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("terminalId");
          });
        }
        else {
          console.log(error);
          this._textDialog.error(messages.format("unknown.error", error.error.message), this._SHOW_MESSAGE_DELAY, () => {
            this.setFocus("terminalId");
          });
        }

      }
    );
  */
  } 

  public onReset() {
    this.submitted = false;
    this.frmAddTerminal.reset();
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
