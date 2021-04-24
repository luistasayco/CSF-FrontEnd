import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { DemoService } from '../../../../../services/demo.service';
import { Subscription } from 'rxjs';
import { VentasService } from '../../../../modulo-venta/services/ventas.service';
import { VentaCompartidoService } from '../../services/venta-compartido.service';
import { IPedidoPorAtencion, IDetallePedidoPorPedido } from '../../interfaces/pedido-por-atencion.interface';
import { map } from 'rxjs/operators';
import { IHospital } from '../../../../modulo-venta/interface/venta.interface';

@Component({
  selector: 'app-modal-busqueda-pedidos-por-paciente',
  templateUrl: './modal-busqueda-pedidos-por-paciente.component.html',
  styleUrls: ['./modal-busqueda-pedidos-por-paciente.component.css']
})
export class ModalBusquedaPedidosPorPacienteComponent implements OnInit {
  
  @Input() isModeloHospital: IHospital;
  @Output() eventoCerrar = new EventEmitter();

  subscription$: Subscription;

  isChildrenNode: any[];
  isNode: TreeNode[];
  isSelectItemPedido: IPedidoPorAtencion;
  listDetallePedido: IDetallePedidoPorPedido[];

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  columnas: any;
  constructor(private ventaCompartidoService: VentaCompartidoService) { }

  ngOnInit(): void {
    
    this.onListarPedido();

    this.onHeaderGrilla();
  }

  private onHeaderGrilla() {
    this.columnas = [
      { field: 'codpro', header: 'Código' },
      { field: 'tipoproducto', header: 'Tipo Producto' },
      { field: 'despro', header: 'Nombre' },
      { field: 'cantidadpedida', header: 'Cantidad' },
      { field: 'codpedido', header: 'Pedido' }
    ];
  }

  private onListarPedido() {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListPedidosPorAtencion(this.isModeloHospital.codatencion)
    .pipe(
      map((resp: IPedidoPorAtencion[]) => {
        this.onBuildTreeNode(resp);
      })
    )
    .subscribe(
      (resp) => {},
      (error) => {
        // this.messageService.add({severity:'error', summary: this.globalConstants.msgErrorSummary, detail: error.error});
    });
  }

  onBuildTreeNode(resp: IPedidoPorAtencion[]) {
    this.isChildrenNode = [];
    for (let item of resp) {
      this.isChildrenNode.push({
        label: item.codpedido,
        data: item,
        expandedIcon: 'fa fa-medkit',
        collapsedIcon: 'fa fa-medkit'
      });
    }
    this.isNode = [];
    this.isNode.push({
      label: 'TODOS',
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      expanded: true,
      children: this.isChildrenNode
    });

  }

  goSelectNodePedido(data: any) {
    this.goListarDetallePedido(data.node.data.codpedido)
    this.isSelectItemPedido =  data.node.data;
  }

  goListarDetallePedido(codpedido: string) {
    this.listDetallePedido = [];
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getListPedidoDetallePorPedido(codpedido)
    .pipe(
      map((resp: IDetallePedidoPorPedido[]) => {
        this.listDetallePedido = resp;
      })
    )
    .subscribe(
      (resp) => {},
      (error) => {
        // this.messageService.add({severity:'error', summary: this.globalConstants.msgErrorSummary, detail: error.error});
    });
  }

  goCerrar() {
    this.eventoCerrar.emit();
  }
}
