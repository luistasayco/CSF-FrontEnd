import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//module
import { ConfirmacionSolicitudTranferenciaRoutingModule } from './modulo-confirmacion-solicitud-transferencia-routing.module';
import { ConfirmacionSolicitudTransferenciaPrimeNgModule } from './modulo-confirmacion-solicitud-transferencia-primeng.module';

//components
import { PanelConfirmacionSolicitudTransferenciaComponent } from './components/panel-confirmacion-solicitud-transferencia/panel-confirmacion-solicitud-transferencia.component';
import { ConfirmacionSolicitudTransferenciaCrearComponent } from './components/panel-confirmacion-solicitud-transferencia/confirmacion-solicitud-tranferencia-crear/confirmacion-solicitud-transferencia-crear.component';
import { ConfirmacionSolicitudTraslaVerComponent } from './components/panel-confirmacion-solicitud-transferencia/confirmacion-solicitud-tranferencia-ver/confirmacion-solicitud-tranferencia-ver.component';
import { ConfirmacionSolicitudTransferenciaLoteComponent } from './components/panel-confirmacion-solicitud-transferencia/confirmacion-solicitud-tranferencia-lote/confirmacion-solicitud-tranferencia-lote.component';
import { ConfirmacionSolicitudTrasladoArticuloVerComponent } from './components/panel-confirmacion-solicitud-transferencia/confirmacion-solicitud-tranferencia-articulo-ver/confirmacion-solicitud-tranferencia-articulo-ver.component';
//compartido
import { RequerimientoCompartidoModule } from '../modulo-compartido/Requerimiento/modulo-requerimiento-compartido.module';


@NgModule({
    declarations: [
        PanelConfirmacionSolicitudTransferenciaComponent,
        ConfirmacionSolicitudTransferenciaCrearComponent,
        ConfirmacionSolicitudTraslaVerComponent,
        ConfirmacionSolicitudTransferenciaLoteComponent,
        ConfirmacionSolicitudTrasladoArticuloVerComponent
    ],
    imports: [ CommonModule, ConfirmacionSolicitudTransferenciaPrimeNgModule, ConfirmacionSolicitudTranferenciaRoutingModule, ReactiveFormsModule, FormsModule, RequerimientoCompartidoModule],
    exports: [],
    providers: [],
})
export class ConfirmacionSolicitudTransferenciaModule {}
