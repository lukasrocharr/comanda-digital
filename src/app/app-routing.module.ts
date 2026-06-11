import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent, LoginComponent, RegisterComponent, PedidoStatusComponent, MeusPedidosComponent } from './pages/pages-client';
import { CardapioComponent, PratoDetalheComponent, CheckoutComponent } from './pages/pages-cardapio';
import { DashboardComponent, PedidosAdminComponent, PratosComponent, FichasComponent, IngredientesComponent, FornecedoresComponent, ComprasComponent, UsuariosComponent, CategoriasComponent, EstoqueComponent } from './pages/pages-admin';
import { adminGuard } from './services/admin.guard';

const routes: Routes = [
  { path: '',                  component: HomeComponent },
  { path: 'cardapio',          component: CardapioComponent },
  { path: 'cardapio/:id',      component: PratoDetalheComponent },
  { path: 'login',             component: LoginComponent },
  { path: 'register',          component: RegisterComponent },
  { path: 'checkout',          component: CheckoutComponent },
  { path: 'status',            component: PedidoStatusComponent },
  { path: 'pedidos',           component: MeusPedidosComponent },
  { path: 'admin/dashboard',    component: DashboardComponent,    canActivate: [adminGuard] },
  { path: 'admin/pedidos',      component: PedidosAdminComponent, canActivate: [adminGuard] },
  { path: 'admin/pratos',       component: PratosComponent,       canActivate: [adminGuard] },
  { path: 'admin/fichas',       component: FichasComponent,       canActivate: [adminGuard] },
  { path: 'admin/ingredientes', component: IngredientesComponent, canActivate: [adminGuard] },
  { path: 'admin/fornecedores', component: FornecedoresComponent, canActivate: [adminGuard] },
  { path: 'admin/compras',      component: ComprasComponent,      canActivate: [adminGuard] },
  { path: 'admin/usuarios',     component: UsuariosComponent,     canActivate: [adminGuard] },
  { path: 'admin/categorias',   component: CategoriasComponent,   canActivate: [adminGuard] },
  { path: 'admin/estoque',      component: EstoqueComponent,      canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
