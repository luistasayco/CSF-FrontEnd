import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//module
import { AtencionSolicitudTranferenciaExtRoutingModule } from './modulo-atencion-solicitud-transferencia-ext-routing.module';
import { AtencionSolicitudTransferenciaExtPrimeNgModule } from './modulo-atencion-solicitud-transferencia-ext-primeng.module';

//components
import { PanelAtensionSolicitudTransferenciaExtComponent } from './components/panel-atencion-solicitud-transferencia-ext/panel-atencion-solicitud-transferencia-ext.component';
import { AtensionSolicitudTransferenciaExtCrearComponent } from './components/panel-atencion-solicitud-transferencia-ext/atencion-solicitud-tranferencia-ext-crear/atencion-solicitud-transferencia-ext-crear.component';
import { AtencionSolicitudTraslaExtVerComponent } from './components/panel-atencion-solicitud-transferencia-ext/atencion-solicitud-tranferencia-ext-ver/atencion-solicitud-tranferencia-ext-ver.component';
import { AtencionSolicitudTransferenciaExtLoteComponent } from './components/panel-atencion-solicitud-transferencia-ext/atencion-solicitud-tranferencia-ext-lote/atencion-solicitud-tranferencia-ext-lote.component';
import { AtencionSolicitudTrasladoExtArticuloVerComponent } from './components/panel-atencion-solicitud-transferencia-ext/atencion-solicitud-tranferencia-ext-articulo-ver/atencion-solicitud-tranferencia-ext-articulo-ver.component';

import { RequerimientoCompartidoModule } from '../modulo-compartido/Requerimiento/modulo-requerimiento-compartido.module';
    

@NgModule({
    declarations: [
        PanelAtensionSolicitudTransferenciaExtComponent,
        AtensionSolicitudTransferenciaExtCrearComponent,
        AtencionSolicitudTraslaExtVerComponent,
        AtencionSolicitudTransferenciaExtLoteComponent,
        AtencionSolicitudTrasladoExtArticuloVerComponent

    ],
    imports: [ CommonModule, AtencionSolicitudTransferenciaExtPrimeNgModule, AtencionSolicitudTranferenciaExtRoutingModule, ReactiveFormsModule, FormsModule, RequerimientoCompartidoModule],
    exports: [],
    providers: [],
})
export class AtencionSolicitudTransferenciaExtModule {}
