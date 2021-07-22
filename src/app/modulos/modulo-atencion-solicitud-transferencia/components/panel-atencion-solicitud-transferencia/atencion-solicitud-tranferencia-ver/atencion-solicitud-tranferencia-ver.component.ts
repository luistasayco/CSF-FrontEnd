import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

//services
import { AtencionSolicitudTrasladoService  } from '../../../services/atencion-solicitud-traslado.service';

@Component({
  selector: 'app-atencion-solicitud-tranferencia-ver',
  templateUrl: './atencion-solicitud-tranferencia-ver.component.html',
  styleUrls: ['./atencion-solicitud-tranferencia-ver.component.scss'],
})

export class AtencionSolicitudTraslaVerComponent implements OnInit {
  @Input() item;

  itemAtencionSolicitud: any;
  itemSolicitudDetalle: any = [];
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  constructor(
      private readonly solicitudTrasladoService: AtencionSolicitudTrasladoService
      ) {}
  
  ngOnInit(): void {

    this.itemAtencionSolicitud={
      desAtencionSolicitudTransferenciaEstado:"",
      idSolicitudTraslado:0,
      desSolicitudTrasladoEstado:"",
      codSocioNegocio:"",
      nombreSocioNegocio:"",
      codAlmacenDestino:"",
      desAlmacenDestino:"",
      desAtencionSolicitudTransferenciaTipoMovimiento:"",
      usuario:{nombresApellidos:""}
    }
    
    this.getAtencionSolicitudTraslado(this.item.idAtencionSolicitudTransferencia);

  }
  getAtencionSolicitudTraslado(id: number) {
    
    this.solicitudTrasladoService
      .getAllById(id)
      .pipe(
        map((resp) => {
          this.itemAtencionSolicitud = resp;
        })
      )
      .subscribe();
  }

}
