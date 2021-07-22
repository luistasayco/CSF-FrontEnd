import { ConfirmationService } from 'primeng/api';
import { Component,Input,Output,EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

// const
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';

//services
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';
import { UtilService } from '../../../../../services/util.service';
import { LanguageService } from '../../../../../services/language.service';
import { ConfirmacionSolicitudTrasladoService } from '../../../services/confirmacion-solicitud-traslado.service';

//Routing
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion-solicitud-tranferencia-lote',
  templateUrl: './confirmacion-solicitud-tranferencia-lote.component.html',
  styleUrls: ['./confirmacion-solicitud-tranferencia-lote.component.css']
})

export class ConfirmacionSolicitudTransferenciaLoteComponent implements OnInit {
  @Input() isDisplayCantidaEditar;
  @Input() itemArticulo;
  @Input() itemAlmacen;
  @Output() itemSeleccionado = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  
  //formularioSuperiorLote: FormGroup; //jc

  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;

  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Formulario de Busqueda
  formularioEditarCantida: FormGroup;
  //tituloLote: any;
  //lista
  listaLoteItem: any =[];
  //botton
  seleccionArticulo=false;

  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    public readonly mensajePrimeNgService: MensajePrimeNgService,
    private readonly utilService: UtilService,
    public readonly lenguageService: LanguageService,
    private readonly confirmacionSolicitudTrasladoService: ConfirmacionSolicitudTrasladoService,
    private readonly confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    this.obtenerLote();

  }


  clickAceptar(){
    
    var totalCantidadEntregar=0;

    this.listaLoteItem.forEach((item) => {
      totalCantidadEntregar += item.cantidadEntregada;
      
    });

    if(totalCantidadEntregar==this.itemArticulo.cantidadEntregada)
    {

      var itemSelec = {
        codArticulo:this.itemArticulo.codArticulo,
        desArticulo:this.itemArticulo.codArticulo,
        idAtencionSolicitudTransferenciaItem:this.itemArticulo.idAtencionSolicitudTransferenciaItem,
        lote:this.listaLoteItem
      }

      this.itemSeleccionado.emit(itemSelec);
      this.cancel.emit();

    }
    else{
      this.messageService.add({key: 'myKey1', severity:'warn', summary: 'Mensaje', detail: 'Deben ser iguales, a la cantidad total a entregar'});    
    }
    
    
  }

  obtenerLote(){
    this.loading = true;
    

    this.confirmacionSolicitudTrasladoService
        .getLoteByItemCode(this.itemArticulo.codArticulo,this.itemAlmacen.codAlmacenOrigen)
        .pipe(
          map((resp) => {
            var cantidadEntregada=0;
            this.listaLoteItem=[];
            for (const item of resp) {
              if(this.itemArticulo.confirmacionSolicitudTransferenciaItemLote!=undefined){
                var result =this.itemArticulo.confirmacionSolicitudTransferenciaItemLote.find(x=> x.numLote==item.batchNum);
                cantidadEntregada=result.cantidadEntregada;
              }
              this.listaLoteItem.push({numLote:item.batchNum,cantidad:item.quantityLote,cantidadEntregada:cantidadEntregada});
            }
            
          })
        )
        .subscribe(
          (resp) => {
            this.loading = false;
          },
          (error) => {
            this.mensajePrimeNgService.onToErrorMsg(null, "ERROR EL SERVICIO NO CARGO CORRECTAMENTE");
          }
        );
  }

  onKeypressEvent(model: any,event: any){
    
    setTimeout(() => {
      if(model.cantidadEntregada>model.cantidad){
        model.cantidadEntregada = model.cantidad;
        this.messageService.add({key: 'myKey1', severity:'error', summary: 'Mensaje', detail: 'La Cantidad debe ser menor o gual, que la cantidad entregada'});    
        event.preventDefault();
      }

    }, 0);
    
 }



}