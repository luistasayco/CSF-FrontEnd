import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';

//services
import { ConfirmacionSolicitudTrasladoService  } from '../../../services/confirmacion-solicitud-traslado.service';

@Component({
  selector: 'app-confirmacion-solicitud-tranferencia-ext-articulo-ver',
  templateUrl: './confirmacion-solicitud-tranferencia-ext-articulo-ver.component.html',
  styleUrls: ['./confirmacion-solicitud-tranferencia-ext-articulo-ver.component.scss'],
})

export class ConfirmacionSolicitudTrasladoExtArticuloVerComponent implements OnInit {
  
  @Input() item;
  @Input() itemAlmacen;

  itemArticulo: any;
  itemArticuloLote: any = [];
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  isVisibleLote=false;
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;

  constructor(
      private readonly confirmacionTrasladoService: ConfirmacionSolicitudTrasladoService
      ) {}
  
  ngOnInit(): void {
    

    this.itemArticulo={
      itemCode:"",
      itemName:"",
      whsCode:"",
      whsName:"",
      lote:[]
    }
    
    this.getArticuloVer();

  }
  getArticuloVer() {
    //desAlmacenOrigen
    this.confirmacionTrasladoService
      .getArticuloVer(this.item.codArticulo,this.itemAlmacen.codAlmacenOrigen)
      .pipe(
        map((resp) => {
          this.itemArticulo = resp[0];
          if(this.itemArticulo.lote.length>0){
              this.isVisibleLote=true;
          }

        })
      )
      .subscribe();
  }

 

}
