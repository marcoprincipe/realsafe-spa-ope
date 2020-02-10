import { Component, OnInit } from '@angular/core';

/**
 * Componente para apresentação do header da aplicação.
 */

@Component({
  selector: 'rs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * Construtor default do componente.
   */

  constructor() { 
  }

  /**
   * Inicializa o componente para utilização.
   */

  ngOnInit(): void {
  }

}
