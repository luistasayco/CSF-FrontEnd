import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

//services
import { ConfirmacionSolicitudTrasladoService  } from '../../../services/confirmacion-solicitud-traslado.service';

@Component({
  selector: 'app-confirmacion-solicitud-tranferencia-ver',
  templateUrl: './confirmacion-solicitud-tranferencia-ver.component.html',
  styleUrls: ['./confirmacion-solicitud-tranferencia-ver.component.scss'],
})

export class ConfirmacionSolicitudTraslaVerComponent implements OnInit {
  @Input() item;

  itemConfirmadoSolicitud: any;
  itemSolicitudDetalle: any = [];
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  constructor(
      private readonly confirmacionTrasladoService: ConfirmacionSolicitudTrasladoService
      ) {}
  
  ngOnInit(): void {
    
    
    this.itemConfirmadoSolicitud={
      desAtencionSolicitudTransferenciaEstado:"",
      atencionSolicitudTransferencia:{idSolicitudTraslado:0,solicitudTraslado:{solicitudTrasladoEstado:{desSolicitudTrasladoEstado:""}}},
      desSolicitudTrasladoEstado:"",
      codSocioNegocio:"",
      nombreSocioNegocio:"",
      codAlmacenDestino:"",
      desAlmacenDestino:"",
      desAtencionSolicitudTransferenciaTipoMovimiento:"",
      usuario:{nombresApellidos:""}
    }

    this.getAtencionSolicitudTraslado(this.item.idConfirmacionSolicitudTransferencia);

  }
  getAtencionSolicitudTraslado(id: number) {
    
    //getConfirmadoAllById
    this.confirmacionTrasladoService
      .getAllById(id)
      .pipe(
        map((resp) => {
          this.itemConfirmadoSolicitud = resp;
        })
      )
      .subscribe();
  }

}
