import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CompanyDetail, ListCompanyDetailsRequest} from 'src/app/payload';
import { CommAreaService } from 'src/app/shared/services/comm-area.service';
import { TimeoutService } from 'src/app/shared/services/timeout.service';
import { CompanyService } from 'src/app/services/company.service';

declare const $: any;

/**
 * Diálogo para apresentação de detalhes de empresa.
 */

@Component({
  selector: 'rs-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit, OnDestroy {

  /**
   * Declaração das variáveis membro
   */

  public isCompanyDetail: boolean = false;

  public company: Array<CompanyDetail>;

  @Input()
  public visible: boolean = false;

  @Output()
  public visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Construtor default do diálogo.
   * @param companyService - Instância do serviço de empresas.
   * @param commAreaService - Instância do serviço de dados comuns.
   * @param timeoutService - Instância do serviço de timeout.
   */

  constructor(
   private commAreaService: CommAreaService,
   private companyService: CompanyService,
   private timeoutService: TimeoutService) {
  }

 /**
   * Inicializa o componente para utilização.
   */

  ngOnInit() {

    this.timeoutService.onTimeout(() => {
      this.hide();
    });

    const request: ListCompanyDetailsRequest = this.commAreaService.data["listCompanyDetailsRequest"];

    delete this.commAreaService.data["listCompanyDetailsRequest"];

    this.companyService.listCompanyDetails(request).subscribe(
      (response) => {
        this.company = response.data.company;
        this.isCompanyDetail = true;
        this.show();
    },
    (error) => {
        console.log(error);
    });
  } 

  /**
   * Apresenta o diálogo para visualização dos dados da empresa.
   */

  public show(): void {

    $("#companyDetailDialog").on('shown.bs.modal', function () {
      setTimeout(() => {
          $("#btnExit").trigger('focus')
        }, 100);
    })

    $("#companyDetailDialog").modal({ backdrop: 'static', keyboard: true });

  }

  /**
   * Esconde o diálogo de confirmação.
   */

  public hide(): void {

    $("#companyDetailDialog").modal('hide');

    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  /**
   * Efetua o cleanup do componente.
   */

  ngOnDestroy(): void {

    this.isCompanyDetail = false;

    this.timeoutService.stop();
  }

}
