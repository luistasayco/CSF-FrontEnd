import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { LanguageService } from '../../../../../services/language.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { IWarehouses } from '../../../../modulo-compartido/Ventas/interfaces/warehouses.interface';
import { IPaciente } from '../../../../modulo-compartido/Ventas/interfaces/paciente.interface';
import { IStock } from '../../../../modulo-compartido/Ventas/interfaces/stock.interface';
import { ISalaOperacionDetalleCreate, ISalaOperacionCreate, ISalaOperacionDetalleSave, ISalaOperacionDetalleLoteSave, ISalaOperacionDetalleUbicacionSave, IResultBusquedaSalaOperacionRol } from '../../../interface/sala-operacion.interface';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IAutenticarResponse } from '../../../../modulo-compartido/Ventas/interfaces/autenticar.interface';
import { VentasService } from '../../../services/ventas.service';
import { map } from 'rxjs/operators';
import swal from'sweetalert2';

@Component({
  selector: 'app-sala-operacion-create',
  templateUrl: './sala-operacion-create.component.html',
  styleUrls: ['./sala-operacion-create.component.css']
})
export class SalaOperacionCreateComponent implements OnInit, OnDestroy {

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  // Formulario
  formularioCabecera: FormGroup;
  subscription$: Subscription;
  loading: boolean;

  // Variables
  isCodAtencion: string;
  isWarehouseCode: string;

  isSeleccionItemProducto: ISalaOperacionDetalleCreate;
  isSeleccionItemLote: ISalaOperacionDetalleCreate;

  isIndexItemVentaDetalle: number;

  // Columnas
  columnas: any[];

  // Listas
  listModelo: ISalaOperacionDetalleCreate[]
  selectedCar: any;

  isVisualizarProducto: boolean = false;
  isVisualizarLote: boolean = false;
  isVisualizarAutenticar: boolean = false;
  isDisplaySave: boolean;

  constructor(private breadcrumbService: BreadcrumbService,
              public lenguageService: LanguageService,
              private readonly formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly ventasService: VentasService) { 
    this.breadcrumbService.setItems([
      { label: 'Módulo Venta' },
      { label: 'Sala Operación', routerLink: ['module-ve/panel-venta'] }
    ]);
  }

  ngOnInit(): void {
    this.buildForm();
    this.inicializar();
    this.onHeaderGrilla();
  }

  private buildForm() {
    this.formularioCabecera = this.formBuilder.group({
      codrolsala: [{value: 0, disabled: true}],
      fecha: [{value: new Date(), disabled: true}],
      codalmacen: [null],
      desalmacen: [null],
      codatencion: [null],
      nombre: [{value: null, disabled: true}]
    });
  }

  private inicializar() {
    this.isWarehouseCode = '00000004';
    this.isCodAtencion = '';
    this.listModelo = [];
  }

  private onHeaderGrilla(){
    this.columnas = [
      { field: 'codproducto', header: 'Cod.Producto' },
      { field: 'lote', header: 'Lote' },
      { field: 'nombreproducto', header: 'Descripción' },
      { field: 'cantidad', header: 'Cantidad' }
    ];
  }

  goAlmacenSeleccionado(item: IWarehouses) {
    this.formularioCabecera.patchValue({
      codalmacen: item.warehouseCode,
      desalmacen: item.warehouseName
    });

    this.isWarehouseCode = item.warehouseCode;
  }

  goAtencionSeleccionado(item: IPaciente) {

    if (item.codatencion.substring(0,1) === 'J') {
      swal.fire(this.globalConstants.msgInfoSummary,'A Pacientes con tipo de atención J, se vende como tipo cliente EXTERNO ','info');
      return;
    }

    if (item.activo !== 1) {
      swal.fire(this.globalConstants.msgInfoSummary,'Atención desactivada','info');
      return;
    }

    if (item.familiar === "S") {
      swal.fire(this.globalConstants.msgInfoSummary,'No puede generar una venta a una atención familiar','info');
      return;
    }

    if (item.traslado === "S") {
      swal.fire(this.globalConstants.msgInfoSummary,'No puede generar una venta a una atención que ha sido trasladada a otra. Consultar nueva atención...!!!','info');
      return;
    }

    this.formularioCabecera.patchValue({
      codatencion: item.codatencion,
      nombre: item.nombrepaciente
    });

    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getListRolSalaOperacionPorAtencion(item.codatencion)
    .pipe(
      map((resp: IResultBusquedaSalaOperacionRol[]) => {
          if (resp.length > 0) {

            if (resp[0].estado !== 'A') {
              swal.fire(this.globalConstants.msgInfoSummary, 'Estado de Rol Operación diferente de A','info')
              return;
            }

            this.formularioCabecera.patchValue({
              codrolsala: resp[0].codrolsala
            });
            
          } else {
            swal.fire(this.globalConstants.msgInfoSummary, 'No existe Rol de Operación para la Atención','info')
            return;
          }
        }
      )
    )
    .subscribe(  
    (resp) => {},
    (error) => {
      this.loading = false;
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });

  }

  goProductoSeleccionado(item: IStock) {

    if (this.onExisteProducto(item)) {
      swal.fire(this.globalConstants.msgInfoSummary, `Producto ${item.itemCode} - ${item.itemName} ya existe` ,'info');
      return;
    }

    let lineaDetalle: ISalaOperacionDetalleCreate = {
      codproducto: item.itemCode,
      nombreproducto: item.itemName,
      cantidad: 1,
      manbtchnum: item.manBtchNum === 'Y' ? true : false,
      binactivat: item.binActivat === 'Y' ? true : false,
      flgbtchnum: false,
      flgbin: false,
      listStockLote: []
    };

    this.listModelo.push(lineaDetalle);
  }

  onExisteProducto(item: IStock): boolean {

    let existe: boolean = false;

    let existsRegistro = this.listModelo.filter(xFila => xFila.codproducto === item.itemCode).length;

    if (existsRegistro > 0) {
      existe = true;
    }

    return existe;

  }

  goChangeVisibleLote(value: ISalaOperacionDetalleCreate, index: number) {
    this.isSeleccionItemLote = value;
    this.isVisualizarLote = !this.isVisualizarLote;
    this.isIndexItemVentaDetalle = index;
  }

  goAceptarLote(value: IStock[]){

    this.isVisualizarLote =!this.isVisualizarLote; 

    this.listModelo[this.isIndexItemVentaDetalle].listStockLote = value;
    this.listModelo[this.isIndexItemVentaDetalle].cantidad = 0;
    
    let isCantidadTotal: number = 0;

    value.forEach(xFila => {
      if (xFila.quantityinput > 0) {
        isCantidadTotal += xFila.quantityinput;
      }
    });

    this.listModelo[this.isIndexItemVentaDetalle].cantidad = isCantidadTotal;

    if (isCantidadTotal === 0) {
      this.listModelo[this.isIndexItemVentaDetalle].flgbtchnum = false;
      this.listModelo[this.isIndexItemVentaDetalle].flgbin = false;
    } else {
      this.listModelo[this.isIndexItemVentaDetalle].flgbtchnum = true;
      this.listModelo[this.isIndexItemVentaDetalle].flgbin = true;
    }
  }

  goSalirLote() {
    this.isVisualizarLote = !this.isVisualizarLote;
  }

  goChangeVisibleProducto(value: ISalaOperacionDetalleCreate) {
    this.isSeleccionItemProducto = value;
    this.isVisualizarProducto = !this.isVisualizarProducto;
  }

  goSalirProducto() {
    this.isVisualizarProducto = !this.isVisualizarProducto;
  }

  goAdicionarCantidadProducto(value: ISalaOperacionDetalleCreate, index: number) {
    this.listModelo[index].cantidad += 1;
  }

  goQuitarCantidadProducto(value: ISalaOperacionDetalleCreate, index: number) {
    this.listModelo[index].cantidad -= 1;

    if (this.listModelo[index].cantidad < 0) {
      this.listModelo[index].cantidad = 0;
    }
  }

  goQuitarProducto(index: number) {
    this.listModelo.splice(+index, 1);
  }

  goLecturarProducto() {
    this.router.navigate(['/main/modulo-ve/sala-operacion-lectura'])
  }

  onGrabar() {

    if (this.listModelo.length === 0) {
      swal.fire(this.globalConstants.msgInfoSummary, 'No existe detalle','info')
      return;
    }

    swal.fire({
      title: 'Generar Borrador',
      text: "¿Desea Generar Borrador?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isVisualizarAutenticar =!this.isVisualizarAutenticar;
      }
    })

  }

  goAceptarGrabar(value: IAutenticarResponse) {

    this.isVisualizarAutenticar =!this.isVisualizarAutenticar;

    const bodyCabecera = this.formularioCabecera.getRawValue();

    if (!value.valido) {
      swal.fire(this.globalConstants.msgInfoSummary,value.observacion,'info')
      return;
    }

    let body = this.onGenerarBody();

    this.isDisplaySave = true;
    this.subscription$ = new Subscription();
    this.subscription$  = this.ventasService.setRegistrarSalaOperacion( body )
    .subscribe((resp: any[]) =>  {

      this.isDisplaySave = false;

      swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail, 'success');
      this.goRegresar();
    },
      (error) => {
        this.isDisplaySave = false;
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
    });
  }

  onGenerarBody(): ISalaOperacionCreate {

    const bodyCabecera = this.formularioCabecera.getRawValue();

    let detalle = [...this.listModelo];
    let listDetalleSave: ISalaOperacionDetalleSave[] = [];
    let listDetalleLoteSave: ISalaOperacionDetalleLoteSave[] = [];
    let listDetalleUbicacionSave: ISalaOperacionDetalleUbicacionSave[] = [];


    for (let item of detalle) {

      listDetalleLoteSave = [];
      listDetalleUbicacionSave = [];

      for (let lote of item.listStockLote) {
        if (item.manbtchnum) {
          let loteSave: ISalaOperacionDetalleLoteSave = {
            codproducto: item.codproducto,
            lote: lote.batchNum,
            fechavencimiento: lote.expDate,
            cantidad: lote.quantityinput
          }
  
          listDetalleLoteSave.push(loteSave);
        }
        
        if (item.binactivat) {

          let existsUbi = [...listDetalleUbicacionSave].filter(xFila => xFila.codproducto === item.codproducto && xFila.ubicacion === lote.binAbs).length;
          
          if (existsUbi === 0) {
            let loteUbicacion: ISalaOperacionDetalleUbicacionSave = {
              codproducto: item.codproducto,
              ubicacion: lote.binAbs,
              ubicaciondescripcion: lote.binCode,
              cantidad: lote.quantityinput
            }
    
            listDetalleUbicacionSave.push(loteUbicacion);
          } else {
            listDetalleUbicacionSave.find(xFila => xFila.codproducto === item.codproducto && xFila.ubicacion === lote.binAbs).cantidad += lote.quantityinput;
          }
        }
      }

      let detalleSave: ISalaOperacionDetalleSave = {
        codproducto: item.codproducto,
        nombreproducto: item.nombreproducto,
        cantidad: item.cantidad,
        manbtchnum: item.manbtchnum,
        binactivat: item.binactivat,
        flgbtchnum: item.flgbtchnum,
        flgbin: item.flgbin,
        listaSalaOperacionDetalleLote: listDetalleLoteSave
      }

      listDetalleSave.push(detalleSave);
    }

    let body: ISalaOperacionCreate = {
      codrolsala: bodyCabecera.codrolsala,
      codatencion: bodyCabecera.codatencion,
      codalmacen: bodyCabecera.codalmacen,
      listaSalaOperacionDetalle: listDetalleSave,
      listSalaOperacionDetalleUbicacion: listDetalleUbicacionSave
    }

    return body;

  }

  goCancelarGrabar() {
    this.isVisualizarAutenticar =!this.isVisualizarAutenticar;
  }
  
  goRegresar() {
    this.router.navigate(['/main/modulo-ve/panel-sala-operacion'])
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
