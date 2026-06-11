import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth.interceptor';

// Shared
import {
  NavbarComponent,
  CartDrawerComponent,
  SidebarComponent,
  ToastComponent,
  ModalComponent
} from './shared/shared.components';

// Client pages
import {
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  PedidoStatusComponent,
  MeusPedidosComponent
} from './pages/pages-client';

// Cardápio pages
import {
  CardapioComponent,
  PratoDetalheComponent,
  CheckoutComponent
} from './pages/pages-cardapio';

// Admin pages
import {
  DashboardComponent,
  PedidosAdminComponent,
  PratosComponent,
  FichasComponent,
  IngredientesComponent,
  FornecedoresComponent,
  ComprasComponent,
  UsuariosComponent,
  CategoriasComponent,
  EstoqueComponent
} from './pages/pages-admin';

@NgModule({
  declarations: [
    AppComponent,
    // shared
    NavbarComponent, CartDrawerComponent, SidebarComponent, ToastComponent, ModalComponent,
    // client
    HomeComponent, LoginComponent, RegisterComponent, PedidoStatusComponent, MeusPedidosComponent,
    // cardapio
    CardapioComponent, PratoDetalheComponent, CheckoutComponent,
    // admin
    DashboardComponent, PedidosAdminComponent, PratosComponent, FichasComponent,
    IngredientesComponent, FornecedoresComponent, ComprasComponent,
    UsuariosComponent, CategoriasComponent, EstoqueComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
