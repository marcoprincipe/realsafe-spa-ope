import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { DepositoryComponent } from './components/depository/depository.component';
import { InitializerComponent, RegistrationMenuComponent, OwnerComponent, GroupComponent, CompanyComponent, UnitComponent, UserComponent, RoleComponent, FunctionalityComponent, GeographicComponent, ClosingComponent, OpeningComponent, CashCollectionComponent, ChangePasswordComponent } from './components';
import { BankStatementComponent } from './components';
import { AccessMenuComponent } from './components/access-menu/access-menu.component';
//import { ParameterComponent } from "./components/registration-menu/parameter/parameter.component";
import { TransportCompanyComponent } from './components/registration-menu/transport-company/transport-company.component';
import { TerminalComponent } from './components/registration-menu/terminal/terminal.component';
import { VoucherReprintComponent } from './components/voucher-reprint/voucher-reprint.component';

/**
 * Definição das rotas da aplicação.
 */

const routes: Routes = [
  
  { path: "initialize", component: InitializerComponent },
  { path: "login", component: LoginComponent },
  { path: "access-menu", component: AccessMenuComponent },
  { path: "menu", component: MenuComponent },
  { path: "deposit", component: DepositoryComponent },
  { path: "bank-statement", component: BankStatementComponent },
  { path: "accounting-opening", component: OpeningComponent },
  { path: "accounting-closing", component: ClosingComponent },
  { path: "change-password", component: ChangePasswordComponent },
  { path: "cash-collection", component: CashCollectionComponent },
  { path: "voucher-reprint", component: VoucherReprintComponent },
  { path: "registration-menu", component: RegistrationMenuComponent, data: { parentId: 7 } },
  { path: "group-owner", component: OwnerComponent, data: { parentId: 7 } },
  { path: "group-registration", component: GroupComponent, data: { parentId: 7 } },
  { path: "company-registration", component: CompanyComponent, data: { parentId: 7 } },
  { path: "unit-registration", component: UnitComponent, data: { parentId: 7 } },
  { path: "user-registration", component: UserComponent, data: { parentId: 7 } },
  { path: "role-registration", component: RoleComponent, data: { parentId: 7 } },
  { path: "functionality-registration", component: FunctionalityComponent, data: { parentId: 7 } },
  { path: "geographic-registration", component: GeographicComponent, data: { parentId: 7 } },
  //{ path: "parameter-registration", component: ParameterComponent, data: { parentId: 7 } },
  
  { path: "transport-company-registration", component: TransportCompanyComponent, data: { parentId: 7 } },
  { path: "terminal-registration", component: TerminalComponent, data: { parentId: 7 } },
  
  { path: "", redirectTo: "initialize", pathMatch: "full"},
  { path: "realsafe-ope", redirectTo: "initialize", pathMatch: "full"}

];


/**
 * Módulo para tratamento das rotas da aplicação.
 */

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
