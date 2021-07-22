import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//module
import { AtencionSolicitudTranferenciaRoutingModule } from './modulo-atencion-solicitud-transferencia-routing.module';
import { AtencionSolicitudTransferenciaPrimeNgModule } from './modulo-atencion-solicitud-transferencia-primeng.module';

//components
import { PanelAtensionSolicitudTransferenciaComponent } from './components/panel-atencion-solicitud-transferencia/panel-atencion-solicitud-transferencia.component';
import { AtensionSolicitudTransferenciaCrearComponent } from './components/panel-atencion-solicitud-transferencia/atencion-solicitud-tranferencia-crear/atencion-solicitud-transferencia-crear.component';
import { AtencionSolicitudTraslaVerComponent } from './components/panel-atencion-solicitud-transferencia/atencion-solicitud-tranferencia-ver/atencion-solicitud-tranferencia-ver.component';
import { AtencionSolicitudTrasladoArticuloVerComponent } from './components/panel-atencion-solicitud-transferencia/atencion-solicitud-tranferencia-articulo-ver/atencion-solicitud-tranferencia-articulo-ver.component';


import { RequerimientoCompartidoModule } from '../modulo-compartido/Requerimiento/modulo-requerimiento-compartido.module';
    

@NgModule({
    declarations: [
        PanelAtensionSolicitudTransferenciaComponent,
        AtensionSolicitudTransferenciaCrearComponent,
        AtencionSolicitudTraslaVerComponent,
        AtencionSolicitudTrasladoArticuloVerComponent
        
    ],
    imports: [ CommonModule, AtencionSolicitudTransferenciaPrimeNgModule, AtencionSolicitudTranferenciaRoutingModule, ReactiveFormsModule, FormsModule, RequerimientoCompartidoModule],
    exports: [],
    providers: [],
})
export class AtencionSolicitudTransferenciaModule {}
