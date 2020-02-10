import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { messages } from '../../messages/AppMessages';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { TextDialogComponent } from 'src/app/shared/dialogs';
import { Router } from '@angular/router';
import { Formatter } from 'src/app/shared/formatters';
import { ChangePasswordRequest } from 'src/app/payload';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { UserService } from 'src/app/services/user.service';

declare const $: any;

/**
 * Interface para armazenamento dos dados do form.
 */

interface Form {
  userId: string,
  newPassword: string,
  repeatNewPassword: string
}

/**
 * Componente para realização da troca de senha de um usuário.
 */

@Component({
  selector: 'rs-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ TimeoutService ]
})
export class ChangePasswordComponent implements OnInit {

  /**
   * Declaração das constantes da classe
   */

  private readonly _SHOW_MESSAGE_DELAY: number = 3000;

  /**
   * Declaração das variáveis membro.
   */

  public form: Form = {
    userId: "",
    newPassword: "",
    repeatNewPassword: ""
  };

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
   * @param router - Instância do gerenciador de rotas da aplicação.
   * @param appConfigService - Instância do serviço de configurações.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param userService - Instância do serviço de usuários.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
    private router: Router,
    private appConfigService: AppConfigService,
    private commAreaService: CommAreaService,
    private userService: UserService,
    private timeoutService: TimeoutService) {
  };

  /**
   * Inicializa o componente para utilização.
   */

  public ngOnInit(): void {

    this.timeoutService.onTimeout(() => {
      this.goBack();
    });
    
    this.form.userId = "";
    this.form.newPassword = "";
    this.form.repeatNewPassword = "";
    
    this.message = null;

    this.useVK = this.appConfigService.useVK;

    this.setFocus("userId");

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
   * Recebe o evento do pressionamento da tecla enter no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onEnterClicked(event: any) {
    if (event.fieldId === "userId") {
      this.form[`${event.fieldId}`] = Formatter.cpf(Formatter.padLeft(event.value, "0", 11));
    }
    else {
      this.form[`${event.fieldId}`] = event.value;
    }
    $(`#${event.fieldId}`).focus();
  }

  /**
   * Recebe o evento do pressionamento da tecla cancelar no teclado virtual.
   * 
   * @param event - Evento com os dados do teclado.
   */

  public onCancelClicked(event: any) {
    this.form[`${event.fieldId}`] = event.value;
    $(`#${event.fieldId}`).focus();
  }

  /**
   * Habilita ou desabilita o botão de envio.
   */

  public disableSendButton(): boolean {

    if (this.form.userId.trim() === "" || 
        this.form.newPassword.trim() === "" ||
        this.form.repeatNewPassword.trim() === "") {
        return true;
    }

    if (this.form.newPassword !== this.form.repeatNewPassword) {
        return true;
    }

    return false;

  }

  /**
   * Recebe o evento click do botão cancelar.
   */

  public onCancel(): void {
    this.goBack();
  }

  /**
   * Efetua a troca de senha do usuário.
   */

  public doChangePassword(): void {

    const cpf: string = Formatter.unFormat(this.form.userId);

    const request: ChangePasswordRequest = {
      groupOwnerId: this.commAreaService.groupOwner.groupOwnerId,
      userId: Number(cpf),
      password: this.form.newPassword
    };

    this.message = null;

    this.userService.changePassword(request).subscribe(
      (response) => {
        this._textDialog.info(messages["change.password.success"], this._SHOW_MESSAGE_DELAY, () => {
          this.goBack();
        });
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
      }
    );

  }

  /**
   * Recebe o evento keydown do documento.
   */

  @HostListener('document:keydown', ['$event'])
  public onKeyDown(event: any) {

    this.timeoutService.reset();

    if (event.key === 'Escape') {
        this.goBack();
    }

  }

  /**
   * Recebe o evento mousedown do documento.
   */

  @HostListener('document:mousedown', ['$event'])
  public onMouseDown(event: any) {

    this.timeoutService.reset();

  }

  /**
   * Retorna para a tela de menu.
   */

  public goBack() {
    this.router.navigate(['menu']);
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
