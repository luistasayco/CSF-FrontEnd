import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaPrimeNgModule } from './modulo-venta-primeng.module';
import { VentaRoutingModule } from './modulo-venta-routing.module';
import { PanelVentaComponent } from './components/panel-venta/panel-venta.component';
import { VentaCreateComponent } from './components/panel-venta/venta-create/venta-create.component';
import { VentaDevolucionComponent } from './components/panel-venta/venta-devolucion/venta-devolucion.component';
import { VentaPendienteComponent } from './components/panel-venta/venta-pendiente/venta-pendiente.component';
import { PanelCajaComponent } from './components/panel-caja/panel-caja.component';
import { PanelComprobanteComponent } from './components/panel-comprobante/panel-comprobante.component';
import { PanelPedidosPorPacienteComponent } from './components/panel-pedidos-por-paciente/panel-pedidos-por-paciente.component';
import { PanelPlanesComponent } from './components/panel-planes/panel-planes.component';
import { PanelPlanillaComponent } from './components/panel-planilla/panel-planilla.component';
import { PanelSeguimientoComponent } from './components/panel-seguimiento/panel-seguimiento.component';
import { PanelPedidoComponent } from './components/panel-pedido/panel-pedido.component';
import { ControlsModule } from '../modulo-controls/modulo-controls.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanesCreateComponent } from './components/panel-planes/planes-create/planes-create.component';
import { VentasCompartidoModule } from '../modulo-compartido/Ventas/modulo-ventas-compartido.module';
import { PanelSalaOperacionComponent } from './components/panel-sala-operacion/panel-sala-operacion.component';
import { SalaOperacionCreateComponent } from './components/panel-sala-operacion/sala-operacion-create/sala-operacion-create.component';
import { SalaOperacionLecturaComponent } from './components/panel-sala-operacion/sala-operacion-lectura/sala-operacion-lectura.component';
import { VentaVerComponent } from './components/panel-venta/venta-ver/venta-ver.component';
import { PanelAutenticacionComponent } from './components/panel-autenticacion/panel-autenticacion.component';
import { VentaDatosComponent } from './components/panel-venta/venta-datos/venta-datos.component';
import { VentaSinStockComponent } from './components/panel-venta/venta-sin-stock/venta-sin-stock.component';
import { PanelConsolidadoPedidoComponent } from './components/panel-consolidado-pedido/panel-consolidado-pedido.component';
import { PanelVentaAutomaticoComponent } from './components/panel-venta/panel-venta-automatico/panel-venta-automatico.component';
import { PanelConfigTrxVentaComponent } from './components/panel-config-trx-venta/panel-config-trx-venta.component';
@NgModule({
    declarations: [PanelVentaComponent,
        VentaCreateComponent,
        VentaDevolucionComponent,
        VentaPendienteComponent,
        PanelCajaComponent,
        PanelComprobanteComponent,
        PanelPedidosPorPacienteComponent,
        PanelPlanesComponent,
        PanelPlanillaComponent,
        PanelSeguimientoComponent,
        PanelPedidoComponent,
        PlanesCreateComponent,
        PanelSalaOperacionComponent,
        SalaOperacionCreateComponent,
        SalaOperacionLecturaComponent,
        VentaVerComponent,
        PanelAutenticacionComponent,
        VentaDatosComponent,
        VentaSinStockComponent,
        PanelConsolidadoPedidoComponent,
        PanelVentaAutomaticoComponent,
        PanelConfigTrxVentaComponent
        ],
    imports: [ CommonModule,
        VentaPrimeNgModule,
        VentaRoutingModule,
        ControlsModule,
        FormsModule,
        ReactiveFormsModule,
        VentasCompartidoModule    
    ],
    exports: [],
    providers: [],
})
export class VentaModule {}