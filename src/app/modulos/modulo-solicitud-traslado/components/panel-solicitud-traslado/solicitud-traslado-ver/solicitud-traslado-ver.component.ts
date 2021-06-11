import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
//services
import { SolicitudTrasladoService } from '../../../services/solicitud-traslado.service';

@Component({
  selector: 'app-solicitud-traslado-ver',
  templateUrl: './solicitud-traslado-ver.component.html',
  styleUrls: ['./solicitud-traslado-ver.component.scss'],
})

export class SolicitudTraslaVerComponent implements OnInit {
  @Input() item;

  itemSolicitud: any;
  itemSolicitudDetalle: any = [];

  cols: any[];
  constructor(
      private readonly solicitudTrasladoService: SolicitudTrasladoService
      ) {}
  
  ngOnInit(): void {
    
    this.cabeceraTabla();
    console.log(this.item);
    this.getSolicitudTraslado(this.item.idSolicitudTraslado);

  }
  getSolicitudTraslado(id: number) {
    //getById
    this.solicitudTrasladoService
      .getDetalle(id)
      .pipe(
        map((resp) => {
          
         console.log(resp);
          this.itemSolicitudDetalle = resp;
         
        })
      )
      .subscribe();
  }

  cabeceraTabla() {
    this.cols = [
      { field: 'idSolicitudTrasladoItem', header: 'Nro Solicitud' },
      { field: 'codArticulo', header: 'Cod Articulo' },
      { field: 'desArticulo', header: 'Des Articulo' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'codUnidadMedida', header: 'Cod UM' }
      //{ field: 'desUnidadMedida', header: 'Unidad Medida' }
    ];
  }

 
  estadoSolicitud(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'labelEstado_solicitud__pendiente';
        break;
      case 'EN PROCESO':
        return 'labelEstado_solicitud__enProceso';
        break;
      case 'APROBADO':
        return 'labelEstado_solicitud__aprobado';
        break;
      case 'DESAPROBADO':
        return 'labelEstado_solicitud__desaprobado';
        break;
      case 'POR RECOGER':
        return 'labelEstado_solicitud__porRecoger';
        break;
      case 'ENTREGA PARCIAL':
        return 'labelEstado_solicitud__entregaParcial';
        break;
      case 'ENTREGA TOTAL':
        return 'labelEstado_solicitud__entregaTotal';
        break;
      case 'ANULADO':
        return 'labelEstado_solicitud__anulado';
        break;

      default:
        return null;
        break;
    }
  }
  claseEstado(item: string): string {
    switch (item) {
      case 'APROBADO':
        return 'aprobado';
        break;
      case 'DESAPROBADO':
        return 'desaprobado';
        break;
      case 'PENDIENTE':
        return 'pendiente';
        break;
      case 'ANULADO':
        return 'anulado';
        break;
      case 'PROCESADO SAP':
        return 'procesadoSap';
        break;

      default:
        return null;
        break;
    }
  }
}
