import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalBusquedaAlmacenComponent } from './components/modal-busqueda-almacen/modal-busqueda-almacen.component';
import { ModalBusquedaTipoVentaComponent } from './components/modal-busqueda-tipo-venta/modal-busqueda-tipo-venta.component';
import { VentasCompartidoPrimeNgModule } from './modulo-ventas-compartido-primeng.module';
import { ModalBusquedaClienteExternoComponent } from './components/modal-busqueda-cliente-externo/modal-busqueda-cliente-externo.component';
import { ModalBusquedaAtencionPacienteComponent } from './components/modal-busqueda-atencion-paciente/modal-busqueda-atencion-paciente.component';
import { ModalBusquedaMedicoComponent } from './components/modal-busqueda-medico/modal-busqueda-medico.component';
import { ModalBusquedaTipoMotivoNotaCreditoComponent } from './components/modal-busqueda-tipo-motivo-nota-credito/modal-busqueda-tipo-motivo-nota-credito.component';
import { ModalBusquedaPisoComponent } from './components/modal-busqueda-piso/modal-busqueda-piso.component';
import { ModalBusquedaPabellonComponent } from './components/modal-busqueda-pabellon/modal-busqueda-pabellon.component';
import { ModalBusquedaTipoComprobanteComponent } from './components/modal-busqueda-tipo-comprobante/modal-busqueda-tipo-comprobante.component';
import { ModalBusquedaProductoComponent } from './components/modal-busqueda-producto/modal-busqueda-producto.component';
import { ModalBusquedaRecetaComponent } from './components/modal-busqueda-receta/modal-busqueda-receta.component';
import { ModalBusquedaPedidoComponent } from './components/modal-busqueda-pedido/modal-busqueda-pedido.component';
import { ModalBusquedaPersonalClinicaComponent } from './components/modal-busqueda-personal-clinica/modal-busqueda-personal-clinica.component';
import { ModalBusquedaVentaPorAtencionComponent } from './components/modal-busqueda-venta-por-atencion/modal-busqueda-venta-por-atencion.component';
import { ModalBusquedaPedidosPorPacienteComponent } from './components/modal-busqueda-pedidos-por-paciente/modal-busqueda-pedidos-por-paciente.component';
import { ModalBusquedaGenericoComponent } from './components/modal-busqueda-generico/modal-busqueda-generico.component';
import { ModalBusquedaPedidoDevolucionComponent } from './components/modal-busqueda-pedido-devolucion/modal-busqueda-pedido-devolucion.component';
import { ModalBusquedaNotaCreditoDevolucionComponent } from './components/modal-busqueda-nota-credito-devolucion/modal-busqueda-nota-credito-devolucion.component';

@NgModule({
    declarations: [
        ModalBusquedaAlmacenComponent,
        ModalBusquedaTipoVentaComponent,
        ModalBusquedaClienteExternoComponent,
        ModalBusquedaAtencionPacienteComponent,
        ModalBusquedaMedicoComponent,
        ModalBusquedaTipoMotivoNotaCreditoComponent,
        ModalBusquedaPisoComponent,
        ModalBusquedaPabellonComponent,
        ModalBusquedaTipoComprobanteComponent,
        ModalBusquedaProductoComponent,
        ModalBusquedaRecetaComponent,
        ModalBusquedaPedidoComponent,
        ModalBusquedaPersonalClinicaComponent,
        ModalBusquedaVentaPorAtencionComponent,
        ModalBusquedaPedidosPorPacienteComponent,
        ModalBusquedaGenericoComponent,
        ModalBusquedaPedidoDevolucionComponent,
        ModalBusquedaNotaCreditoDevolucionComponent
    ],
    imports: [ 
        CommonModule,
        FormsModule,
        VentasCompartidoPrimeNgModule,
        ReactiveFormsModule ],
    exports: [
        ModalBusquedaAlmacenComponent,
        ModalBusquedaTipoVentaComponent,
        ModalBusquedaClienteExternoComponent,
        ModalBusquedaAtencionPacienteComponent,
        ModalBusquedaMedicoComponent,
        ModalBusquedaTipoMotivoNotaCreditoComponent,
        ModalBusquedaPisoComponent,
        ModalBusquedaPabellonComponent,
        ModalBusquedaTipoComprobanteComponent,
        ModalBusquedaProductoComponent,
        ModalBusquedaRecetaComponent,
        ModalBusquedaPedidoComponent,
        ModalBusquedaPersonalClinicaComponent,
        ModalBusquedaVentaPorAtencionComponent,
        ModalBusquedaPedidosPorPacienteComponent,
        ModalBusquedaGenericoComponent,
        ModalBusquedaPedidoDevolucionComponent,
        ModalBusquedaNotaCreditoDevolucionComponent
    ],
    providers: [],
})
export class VentasCompartidoModule {}