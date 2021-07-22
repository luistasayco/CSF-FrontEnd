import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//components
 import { PanelConfirmacionSolicitudTransferenciaComponent } from './components/panel-confirmacion-solicitud-transferencia/panel-confirmacion-solicitud-transferencia.component';
 import { ConfirmacionSolicitudTransferenciaCrearComponent } from './components/panel-confirmacion-solicitud-transferencia/confirmacion-solicitud-tranferencia-crear/confirmacion-solicitud-transferencia-crear.component';


const routes: Routes = [
    { path: 'panel-confirmacion-solicitud-transferencia', component: PanelConfirmacionSolicitudTransferenciaComponent },
    { path: 'confirmacion-solicitud-transferencia-crear', component: ConfirmacionSolicitudTransferenciaCrearComponent }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfirmacionSolicitudTranferenciaRoutingModule {}
