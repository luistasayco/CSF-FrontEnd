import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';

//services
import { ConfirmacionSolicitudTrasladoService  } from '../../../services/confirmacion-solicitud-traslado.service';

@Component({
  selector: 'app-confirmacion-solicitud-tranferencia-articulo-ver',
  templateUrl: './confirmacion-solicitud-tranferencia-articulo-ver.component.html',
  styleUrls: ['./confirmacion-solicitud-tranferencia-articulo-ver.component.scss'],
})
//ConfirmacionSolicitudTrasladoArticuloVerComponent
export class ConfirmacionSolicitudTrasladoArticuloVerComponent implements OnInit {
  
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
    
    debugger

    console.log(this.item);
    console.log("item");

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
