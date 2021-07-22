import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//module
import { ConfirmacionSolicitudTranferenciaExtRoutingModule } from './modulo-confirmacion-solicitud-transferencia-ext-routing.module';
import { ConfirmacionSolicitudTransferenciaExtPrimeNgModule } from './modulo-confirmacion-solicitud-transferencia-ext-primeng.module';

//components
import { PanelConfirmacionSolicitudTransferenciaExtComponent } from './components/panel-confirmacion-solicitud-transferencia-ext/panel-confirmacion-solicitud-transferencia-ext.component';
import { ConfirmacionSolicitudTransferenciaExtCrearComponent } from './components/panel-confirmacion-solicitud-transferencia-ext/confirmacion-solicitud-tranferencia-ext-crear/confirmacion-solicitud-transferencia-ext-crear.component';
import { ConfirmacionSolicitudTraslaExtVerComponent } from './components/panel-confirmacion-solicitud-transferencia-ext/confirmacion-solicitud-tranferencia-ext-ver/confirmacion-solicitud-tranferencia-ext-ver.component';
import { ConfirmacionSolicitudTrasladoExtArticuloVerComponent } from './components/panel-confirmacion-solicitud-transferencia-ext/confirmacion-solicitud-tranferencia-ext-articulo-ver/confirmacion-solicitud-tranferencia-ext-articulo-ver.component';

import { RequerimientoCompartidoModule } from '../modulo-compartido/Requerimiento/modulo-requerimiento-compartido.module';
    

@NgModule({
    declarations: [
        PanelConfirmacionSolicitudTransferenciaExtComponent,
        ConfirmacionSolicitudTransferenciaExtCrearComponent,
        ConfirmacionSolicitudTraslaExtVerComponent,
        ConfirmacionSolicitudTrasladoExtArticuloVerComponent
    ],
    imports: [ CommonModule, ConfirmacionSolicitudTransferenciaExtPrimeNgModule, ConfirmacionSolicitudTranferenciaExtRoutingModule, ReactiveFormsModule, FormsModule, RequerimientoCompartidoModule],
    exports: [],
    providers: [],
})
export class ConfirmacionSolicitudTransferenciaExtModule {}
