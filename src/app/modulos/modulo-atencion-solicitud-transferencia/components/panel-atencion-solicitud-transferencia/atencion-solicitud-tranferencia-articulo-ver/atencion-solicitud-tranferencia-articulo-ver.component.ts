import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';

//services
import { AtencionSolicitudTrasladoService  } from '../../../services/atencion-solicitud-traslado.service';

@Component({
  selector: 'app-atencion-solicitud-tranferencia-articulo-ver',
  templateUrl: './atencion-solicitud-tranferencia-articulo-ver.component.html',
  styleUrls: ['./atencion-solicitud-tranferencia-articulo-ver.component.scss'],
})

export class AtencionSolicitudTrasladoArticuloVerComponent implements OnInit {
  @Input() item;
  @Input() itemAlmacen;

  itemArticulo: any;
  itemArticuloLote: any = [];
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  isVisibleLote=false;
  
  constructor(
      private readonly solicitudTrasladoService: AtencionSolicitudTrasladoService
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
    
    this.solicitudTrasladoService
      .getArticuloVer(this.item.codArticulo,this.itemAlmacen.warehouseCode)
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
