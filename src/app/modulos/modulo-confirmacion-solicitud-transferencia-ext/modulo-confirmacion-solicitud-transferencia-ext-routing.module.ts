import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//components
 import { PanelConfirmacionSolicitudTransferenciaExtComponent } from './components/panel-confirmacion-solicitud-transferencia-ext/panel-confirmacion-solicitud-transferencia-ext.component';
 import { ConfirmacionSolicitudTransferenciaExtCrearComponent } from './components/panel-confirmacion-solicitud-transferencia-ext/confirmacion-solicitud-tranferencia-ext-crear/confirmacion-solicitud-transferencia-ext-crear.component';


const routes: Routes = [
    { path: 'panel-confirmacion-solicitud-transferencia-ext', component: PanelConfirmacionSolicitudTransferenciaExtComponent },
    { path: 'confirmacion-solicitud-transferencia-ext-crear', component: ConfirmacionSolicitudTransferenciaExtCrearComponent }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfirmacionSolicitudTranferenciaExtRoutingModule {}
