import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//components
 import { PanelAtensionSolicitudTransferenciaExtComponent } from './components/panel-atencion-solicitud-transferencia-ext/panel-atencion-solicitud-transferencia-ext.component';
 import { AtensionSolicitudTransferenciaExtCrearComponent } from './components/panel-atencion-solicitud-transferencia-ext/atencion-solicitud-tranferencia-ext-crear/atencion-solicitud-transferencia-ext-crear.component';

const routes: Routes = [
    { path: 'panel-atencion-solicitud-transferencia-ext', component: PanelAtensionSolicitudTransferenciaExtComponent },
    { path: 'atencion-solicitud-transferencia-ext-crear', component: AtensionSolicitudTransferenciaExtCrearComponent }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AtencionSolicitudTranferenciaExtRoutingModule {}
