import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//components
 import { PanelAtensionSolicitudTransferenciaComponent } from './components/panel-atencion-solicitud-transferencia/panel-atencion-solicitud-transferencia.component';
 import { AtensionSolicitudTransferenciaCrearComponent } from './components/panel-atencion-solicitud-transferencia/atencion-solicitud-tranferencia-crear/atencion-solicitud-transferencia-crear.component';
 //import { SolicitudTrasladoCrearComponent } from './components/panel-atencion-solicitud-tranferencia/atencion-solicitud-tranferencia-crear/atencion-solicitud-tranferencia-crear.component';

// import { RegistrarValeSalidaComponent } from './components/panel-vale-salida/vale-salida-crear/registrar-vale-salida.component';
// import { ValeSalidaVerComponent } from './components/panel-vale-salida/vale-salida-ver/vale-salida-ver-component';

const routes: Routes = [
    { path: 'panel-atencion-solicitud-transferencia', component: PanelAtensionSolicitudTransferenciaComponent },
    { path: 'atencion-solicitud-transferencia-crear', component: AtensionSolicitudTransferenciaCrearComponent }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AtencionSolicitudTranferenciaRoutingModule {}
