import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalsConstantsForm } from '../../../../constants/globals-constants-form';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IWarehouses } from '../../../modulo-compartido/Ventas/interfaces/warehouses.interface';
import { IPaciente } from '../../../modulo-compartido/Ventas/interfaces/paciente.interface';
import { IVentaDevolucion, IVentaDevolucionSeleccionado, IVentaDetalleLote, ISeparacionCuentaCreate } from '../../interface/venta.interface';
import { map } from 'rxjs/operators';
import { VentaCompartidoService } from '../../../modulo-compartido/Ventas/services/venta-compartido.service';
import { VentasService } from '../../services/ventas.service';
import { IAutenticarResponse } from '../../../modulo-compartido/Ventas/interfaces/autenticar.interface';
import swal from'sweetalert2';

@Component({
  selector: 'app-panel-separacion-cuentas',
  templateUrl: './panel-separacion-cuentas.component.html',
  styleUrls: ['./panel-separacion-cuentas.component.css']
})
export class PanelSeparacionCuentasComponent implements OnInit, OnDestroy {
  // Titulo del componente
  titulo = 'Separación Cuenta';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  //Lista
  listModelo: IVentaDevolucion[];
  listSeleccionadoModelo: IVentaDevolucionSeleccionado[];

  isSeleccionItemModelo: IVentaDevolucion;

  isSeleccionLoteItemModelo: IVentaDevolucionSeleccionado;

  //Columnas
  columnas: any;
  columnasSelection: any;
  // Formulario
  formularioBusqueda: FormGroup;
  subscription$: Subscription;
  loading: boolean;

  //Variables
  isCodAtencion: string;
  rowGroupMetadata: any;
  rowGroupMetadataSelection: any;
  indexSeleccionLote: number;

  //loading
  loadingVentas: boolean;

  isVisualizarProducto: boolean;
  isVisualizarLote: boolean;

  isVisualizarAutenticar: boolean = false;
  isDisplaySave: boolean;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly ventaCompartidoService: VentaCompartidoService,
              private readonly ventasService: VentasService) { }

  ngOnInit(): void {
    this.buildForm();
    this.onHeaderGrilla();

    this.listSeleccionadoModelo = [];
  }

  private buildForm() {
    this.formularioBusqueda = this.formBuilder.group({
      codalmacen: [null],
      desalmacen: [null],
      codatencion: [null],
      nombre: [{value: null, disabled: true}]
    });
  }

  onHeaderGrilla() {
    this.columnas = [
      { field: 'seleccionado', header: '...' },
      { field: 'codproducto', header: 'Código' },
      { field: 'nombreproducto', header: 'Nombre' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'cnt_dev', header: 'Cantidad Dev.' }
    ];

    this.columnasSelection = [
      { field: 'quitar', header: '...' },
      { field: 'lote', header: 'Lote' },
      { field: 'codproducto', header: 'Código' },
      { field: 'nombreproducto', header: 'Nombre' },
      { field: 'cantidad', header: 'Cantidad' }
    ];
  }

  goAlmacenSeleccionado(item: IWarehouses) {
    this.formularioBusqueda.patchValue({
      codalmacen: item.warehouseCode,
      desalmacen: item.warehouseName
    });
  }

  goAtencionSeleccionado(item: IPaciente){
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

    this.formularioBusqueda.patchValue({
      codatencion: item.codatencion,
      nombre: item.nombrepaciente
    });
  }

  goListar() {

    let body = this.formularioBusqueda.getRawValue();

    if (body.codatencion === null || body.codatencion === '') {
      swal.fire(this.globalConstants.msgInfoSummary, 'Ingresar Correctamente el Cod. Atención','info')
      return;
    }

    if (body.codatencion.length < 8) {
      swal.fire(this.globalConstants.msgInfoSummary, 'Ingresar Correctamente el Cod. Atención','info')
      return;
    }

    if (body.codalmacen === null ) {
      swal.fire(this.globalConstants.msgInfoSummary, 'Seleccionar Almacén','info')
      return;
    }

    this.listModelo = [];
    this.loadingVentas = true;
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventaCompartidoService.getVentasPorAtencion('2', body.codatencion, body.codalmacen)
    .pipe(
      map((resp: IVentaDevolucion[]) => {
          this.listModelo = resp;
          this.updateRowGroupMetaData(this.listModelo);
          this.loadingVentas = false;
        }
      )
    )
    .subscribe(  
    (resp) => {},
    (error) => {
      this.loadingVentas = false;
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });
  }

  updateRowGroupMetaData(data: IVentaDevolucion[]) {
    this.rowGroupMetadata = {};
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let rowData = data[i];
            let codventa = rowData.codventa;
            if (i == 0) {
                this.rowGroupMetadata[codventa] = { index: 0, size: 1 };
            }
            else {
                let previousRowData = data[i - 1];
                let previousRowGroup = previousRowData.codventa;
                if (codventa === previousRowGroup)
                    this.rowGroupMetadata[codventa].size++;
                else
                    this.rowGroupMetadata[codventa] = { index: i, size: 1 };
            }
        }
    }
  }

  updateRowGroupMetaDataSelection(data: IVentaDevolucionSeleccionado[]) {
    this.rowGroupMetadataSelection = {};
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let rowData = data[i];
            let codventa = rowData.codventa;
            if (i == 0) {
                this.rowGroupMetadataSelection[codventa] = { index: 0, size: 1 };
            }
            else {
                let previousRowData = data[i - 1];
                let previousRowGroup = previousRowData.codventa;
                if (codventa === previousRowGroup)
                    this.rowGroupMetadataSelection[codventa].size++;
                else
                    this.rowGroupMetadataSelection[codventa] = { index: i, size: 1 };
            }
        }
    }
  }

  goSeleccionarProducto(data: IVentaDevolucion) {

    let existsItemSeleccionado = [...this.listSeleccionadoModelo].filter(xFila => xFila.codventa === data.codventa && xFila.codproducto === data.codproducto).length;

    if (existsItemSeleccionado > 0) {
      swal.fire(this.globalConstants.msgInfoSummary, `Venta: ${data.codventa} - Producto: ${data.codproducto} - ${data.nombreproducto} ya existe`,'info');
      return;
    }

    let cantidad = data.cantidad - data.cnt_dev < 0 ? 0 : data.cantidad - data.cnt_dev;

    if (cantidad === 0) {
      swal.fire(this.globalConstants.msgInfoSummary, `Venta: ${data.codventa} - Producto: ${data.codproducto} - ${data.nombreproducto} no cuenta con cantidad a devolver`,'info');
      return;
    }

    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getDetalleLoteVentaPorCodDetalle(data.coddetalle)
    .pipe(
      map((resp: IVentaDetalleLote[]) => {

        let body: IVentaDevolucionSeleccionado = {
          codventa: data.codventa,
          coddetalle: data.coddetalle,
          codalmacen: data.codalmacen,
          codproducto: data.codproducto,
          nombreproducto: data.nombreproducto,
          cantidad: data.manbtchnum && data.binactivat ? 0 :  cantidad,
          cantidadorigen: cantidad,
          manbtchnum: data.manbtchnum,
          binactivat: data.binactivat,
          listVentasDetalleLotes: resp
        }
    
        this.listSeleccionadoModelo.push(body);
    
        this.updateRowGroupMetaDataSelection(this.listSeleccionadoModelo);
        }
      )
    )
    .subscribe(  
    (resp) => {},
    (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });
  }

  goChangeCantidad(data: IVentaDevolucionSeleccionado, index: number) {

    let cantidadxdevolver = data.cantidadorigen - data.cantidad;

    if (cantidadxdevolver < 0) {
      swal.fire( this.globalConstants.msgInfoSummary, `Solo puede devolver ${data.cantidadorigen} del producto seleccionado`, 'info');
      this.listSeleccionadoModelo[index].cantidad = data.cantidadorigen;
      return;
    }
  }

  goQuitarProducto(index: number) {
    debugger;
    this.listSeleccionadoModelo.splice(+index, 1);
    this.updateRowGroupMetaDataSelection(this.listSeleccionadoModelo);
  }

  goChangeVisibleProducto(value: IVentaDevolucion) {
    this.isVisualizarProducto = !this.isVisualizarProducto;
    this.isSeleccionItemModelo = value;
  }

  goChangeVisibleLote(data: IVentaDevolucionSeleccionado, index: number) {
    this.isSeleccionLoteItemModelo = data;
    this.isVisualizarLote = !this.isVisualizarLote;
    this.indexSeleccionLote = index;
  }

  goAceptarLote(value: IVentaDetalleLote[]) {

    this.isVisualizarLote =!this.isVisualizarLote; 

    this.listSeleccionadoModelo[this.indexSeleccionLote].listVentasDetalleLotes = value;
    this.listSeleccionadoModelo[this.indexSeleccionLote].cantidad = 0;
    
    let isCantidadTotal: number = 0;

    value.forEach(xFila => {
      if (xFila.cantidadxdev > 0) {
        isCantidadTotal += xFila.cantidadxdev;
      }
    });

    this.listSeleccionadoModelo[this.indexSeleccionLote].cantidad = isCantidadTotal;
    
  }

  goSalirLote() {
    this.isVisualizarLote = !this.isVisualizarLote;
  }

  goSalirProducto() {
    this.isVisualizarProducto = !this.isVisualizarProducto;
  }

  goProcesarSeparacionCuenta() {
    if (this.listSeleccionadoModelo.length === 0) {
      swal.fire(this.globalConstants.msgInfoSummary, 'No existe detalle','info')
      return;
    }

    swal.fire({
      title: 'Procesar Separación de Cuentas',
      text: "¿Desea de Procesar Separación de Cuentas?",
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

    if (!value.valido) {
      swal.fire(this.globalConstants.msgInfoSummary,value.observacion,'info')
      return;
    }

    let body: ISeparacionCuentaCreate = {
      listSeparacionCuenta: this.listSeleccionadoModelo,
      usuario: value.usuario
    }

    this.isDisplaySave = true;
    this.subscription$ = new Subscription();
    this.subscription$  = this.ventasService.setRegistrarSeparacionCuenta( body )
    .subscribe((resp: any[]) =>  {

      this.isDisplaySave = false;

      swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail, 'success');

    },
      (error) => {
        this.isDisplaySave = false;
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
    });
  }

  goCancelarGrabar() {

  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

}
