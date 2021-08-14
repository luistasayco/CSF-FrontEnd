import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { LanguageService } from '../../../../../services/language.service';
import { Router } from '@angular/router';
import { IVentaCabeceraSingle, IVentaDetalle, INewVentaDevolucion, IVentaGenerado, ITipoCambio, INewVentaDetalle, IVentaDetalleLote } from '../../../interface/venta.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IPaciente } from '../../../../modulo-compartido/Ventas/interfaces/paciente.interface';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { VentasService } from '../../../services/ventas.service';
import { UtilService } from '../../../../../services/util.service';
import { FunctionDblocalService } from '../../../../modulo-base-datos-local/function-dblocal.service';
import swal from'sweetalert2';
import { ConstantsTablasIDB } from 'src/app/modulos/modulo-base-datos-local/constants/constants-tablas-indexdb';
import { IAutenticarResponse } from '../../../../modulo-compartido/Ventas/interfaces/autenticar.interface';
import { IStock } from '../../../../modulo-compartido/Ventas/interfaces/stock.interface';

@Component({
  selector: 'app-venta-devolucion',
  templateUrl: './venta-devolucion.component.html',
  styleUrls: ['./venta-devolucion.component.css']
})
export class VentaDevolucionComponent implements OnInit, OnDestroy {
  // Titulo del componente
  titulo = 'Consulta Ventas';
  // Name de los botones de accion
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm;

  // Modelo
  modeloItem: IVentaCabeceraSingle;
  isSeleccionItemVentaDetalle: IVentaDetalle;
  isSeleccionItemVentaDetalleLote: IVentaDetalle;

  // Variables
  isIndexItemVentaDetalle: number;
  isCodAtencion: string;
  isNombreMaquina: string;

  // From
  formulario: FormGroup;
  formularioTotales: FormGroup;

  items: MenuItem[];

  listModelo: IVentaDetalle[];

  columnas: any;

  isVisible: boolean = false;
  isVisiblePedido: boolean = false;
  isVisibleNotaCredito: boolean = false;

  // Visualizacion
  isVisualizarProducto: boolean = false;
  isVisualizarLote: boolean = false;
  isAutenticar: boolean = false;
  isDisplaySave: boolean = false;
  isGrabar: boolean = false;

  // Subscription
  subscription$: Subscription;

  constructor(public lenguageService: LanguageService,
              public router: Router,
              private ventasService: VentasService,
              private readonly fb: FormBuilder,
              private readonly utilService: UtilService,
              private readonly functionDblocalService: FunctionDblocalService) {     
  }

  ngOnInit(): void {
    this.onInicializarVariables();
    this.buildForm();
    this.buildFormTotales();
    this.onColumnasGrilla();
  }

  onInicializarVariables() {
    this.isCodAtencion = '';

    this.onTipoCambio();
  }

  onObtieneEstacionTrabajo() {
    this.subscription$ = new Subscription();
    this.subscription$ = this.functionDblocalService.getByKey(ConstantsTablasIDB._TABLA_ESTACION_TRABAJO, 1)
    .subscribe((res: any) => {
        if (res !== undefined) {
          this.isNombreMaquina = res.nombreequipo;
          // this.onObtieneConfiguracionEstacionTrabajo(res.nombreequipo);
        }
      },
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion ,'error')
      }
    );
  }

  onTipoCambio(){
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getGetObtieneTipoCambio()
    .subscribe((res: ITipoCambio[]) => {
      
      if (res.length === 0) {
        swal.fire(this.globalConstants.msgErrorSummary, 'Ingresar el tipo de cambio: Bancario Venta','error');
        return;
      }
      
      this.formulario.patchValue({
        tipocambio: res[0].rate
      });

      },
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion ,'error')
      }
    );
  }

  private buildForm() {
    this.formulario = this.fb.group({
      tipodevolucion: [{value: '01', disabled: false}],
      coddevolucion: [{value: null, disabled: true}],
      fecdevolucion: [{value: new Date(), disabled: true}],
      codventadevolucion: [{value: null, disabled: true}],
      codalmacen: [{value: null, disabled: true}],
      nombrealmacen: [{value: null, disabled: true}],
      fecventa: [{value: null, disabled: true}],
      tipocambio: [{value: null, disabled: true}],
      observacion: [{value: null, disabled: true}],
      codTipoCliente: [{value: null, disabled: true}],
      nombreTipoCliente: [{value: null, disabled: true}],
      codAtencion: [{value: null, disabled: true}],
      codClienteExterno: [{value: null, disabled: true}],
      codPersonal: [{value: null, disabled: true}],
      codmedico: [{value: null, disabled: true}],
      nombremedico: [{value: null, disabled: true}],
      paciente: [{value: null, disabled: true}],
      nombreClientePaciente: [{value: null, disabled: true}],
      direccion: [{value: null, disabled: true}],
      codAseguradora: [{value: null, disabled: true}],
      aseguradora: [{value: null, disabled: true}],
      plan: [{value: null, disabled: true}],
      descuentoPlan: [{value: null, disabled: true}],
      coaseguro: [{value: null, disabled: true}],
      titular: [{value: null, disabled: true}],
      poliza: [{value: null, disabled: true}],
      planPoliza: [{value: null, disabled: true}],
      codContratante: [{value: null, disabled: true}],
      contratante: [{value: null, disabled: true}],
      cama: [{value: null, disabled: true}],
      telefono: [{value: null, disabled: true}],
      codEmpresa: [{value: null, disabled: true}],
      empresa: [{value: null, disabled: true}],
      deducible: [{value: null, disabled: true}],
      nombrediagnostico: [{value: null, disabled: true}],
      nombretipdocidentidad: [{value: null, disabled: true}],
      docidentidad: [{value: null, disabled: true}],
      numeroplanilla: [{value: null, disabled: true}]
    });
  }

  private buildFormTotales() {
    this.formularioTotales = this.fb.group({
      montoDescuentoPlan: [{value:0, disabled: true}],
      montoGNC: [{value:0, disabled: true}],
      montoSubTotal: [{value:0, disabled: true}],
      montoSubTotalPaciente: [{value:0, disabled: true}],
      montoSubTotalAseguradora: [{value:0, disabled: true}],
      montoIGV: [{value:0, disabled: true}],
      montoIGVPaciente: [{value:0, disabled: true}],
      montoIGVAseguradora: [{value:0, disabled: true}],
      montoTotal: [{value:0, disabled: true}],
      montoTotalPaciente: [{value:0, disabled: true}],
      montoTotalAseguradora: [{value:0, disabled: true}],
    });
  }

  private onColumnasGrilla() {
    this.columnas = [
      { field: 'codproducto', header: 'Código' },
      { field: 'lote', header: 'Lote' },
      { field: 'nombreproducto', header: 'Descripción' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'cnt_dev', header: 'Cant. Dev' },
      { field: 'cntxdev', header: 'Cant. a Dev' },
      { field: 'precioventaPVP', header: 'PVP' },
      { field: 'porcentajedctoproducto', header: 'Dscto. Prd.' },
      { field: 'porcentajedctoplan', header: 'Dscto. Plan' },
      { field: 'montopaciente', header: 'Monto Pac.' },
      { field: 'montoaseguradora', header: 'Monto Aseg.' },
      { field: 'valorVVP', header: 'VVP' },
      { field: 'totalsinigv', header: 'Total S/IGV' },
      { field: 'totalconigv', header: 'Total C/IGV' },
      { field: 'gnc', header: 'No Cubierto' }
    ];
  }

  goPedido() {
    this.router.navigate(['/main/modulo-ve/panel-pedido'])
  }

  goAtencionSeleccionado(item: IPaciente) {

    this.onLimpiarForm('01');

    if (item.codatencion.substring(0,1) === 'J') {
      swal.fire(this.globalConstants.msgInfoSummary,'A Pacientes con tipo de atención J, se vende como tipo cliente EXTERNO ','info');
      this.onLimpiarForm('01');
      return;
    }

    if (item.activo !== 1) {
      swal.fire(this.globalConstants.msgInfoSummary,'Atención desactivada','info');
      this.onLimpiarForm('01');
      return;
    }

    if (item.familiar === "S") {
      swal.fire(this.globalConstants.msgInfoSummary,'No puede generar una venta a una atención familiar','info');
      this.onLimpiarForm('01');
      return;
    }

    if (item.traslado === "S") {
      swal.fire(this.globalConstants.msgInfoSummary,'No puede generar una venta a una atención que ha sido trasladada a otra. Consultar nueva atención...!!!','info');
      this.onLimpiarForm('01');
      return;
    }

    this.isCodAtencion = item.codatencion;

    this.formulario.patchValue({
      codAtencion: item.codatencion,
      paciente: item.codpaciente,
      nombreClientePaciente: item.nombrepaciente,
      direccion: item.direccion,
      coaseguro: item.coaseguro,
      codAseguradora: item.codaseguradora,
      aseguradora: item.nombreaseguradora,
      codContratante: item.codcia,
      contratante: item.nombrecontratante,
      titular: item.titular,
      poliza: item.poliza,
      plan: item.codplan,
      descuentoPlan: item.porcentajeplan,
      cama: item.cama,
      telefono: item.telefono,
      planPoliza: item.planpoliza,
      deducible: item.deducible,
      medicoAtencion: item.nombremedico,
      observacionPaciente: item.observacionespaciente,
      observacionAtencion: item.observacionatencion,
      idegctipoatencionmae: item.idegctipoatencionmae,
      observacion: item.observacionatencion
    });
  }

  onLimpiarForm(tipoCliente: string, sinStock: boolean = false) {

    this.formulario.controls.tipodevolucion.enable();
    this.isGrabar = false;

    this.formulario.patchValue({
      fecha: new Date(),
      sinStock: sinStock,
      estado: 'GENERADO',
      codTipoCliente: tipoCliente,
      nombreTipoCliente: 'Paciente',
      codAtencion: null,
      codClienteExterno: null,
      codPersonal: null,
      codMedico: null,
      listMedico: null,
      paciente: null,
      nombreClientePaciente: null,
      direccion: null,
      codAseguradora: null,
      aseguradora: null,
      plan: null,
      descuentoPlan: 0,
      coaseguro: 0,
      titular: null,
      poliza: null,
      planPoliza: null,
      codContratante: null,
      contratante: null,
      cama: null,
      telefono: null,
      codEmpresa: null,
      empresa: null,
      deducible: 0,
      observacionPaciente: null,
      observacionAtencion: null,
      diagnostico: null,
      medicoOtros: null,
      observacionGeneral: null,
      codpedido: null
    });

    this.formularioTotales.patchValue({
      montoDescuentoPlan: 0,
      montoGNC: 0,
      montoSubTotal: 0,
      montoSubTotalPaciente: 0,
      montoSubTotalAseguradora: 0,
      montoIGV: 0,
      montoTotal: 0
    });
  }

  goVisibleVenta(){
    if (this.isCodAtencion.length === 0) {
      swal.fire(this.globalConstants.msgInfoSummary, 'Ingresar Atención', 'info');
      return;
    }

    this.isVisible = !this.isVisible;
  }

  goVisiblePedido () {
    this.isVisiblePedido = !this.isVisiblePedido;
  }



  goVentaPorAtencionAceptar(codventa: string) {
    this.isVisible =!this.isVisible;
    this.goGetVentaPorCodVenta(codventa);
  }

  goGetVentaPorCodVenta(codventa: string) {
    this.subscription$ = new Subscription();
    this.subscription$ = this.ventasService.getVentaPorCodVenta(codventa)
    .pipe(
      map((resp: IVentaCabeceraSingle) => {
        this.modeloItem = resp;
        console.log('this.modeloItem', this.modeloItem );
        this.buildFormSetValue();
        this.listModelo = [];
        this.modeloItem.listaVentaDetalle.map(xFila => {
          xFila.montoaseguradora = 0;  
          xFila.montopaciente = 0;
          xFila.montototal = 0;
          xFila.stockalmacen = 0;
          xFila.cntxdev = 0;
          xFila.tipomovimiento = 'CD';
        });
        this.listModelo = this.modeloItem.listaVentaDetalle;
      })
    )
    .subscribe((resp) => {},
    (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion,'error')
    });
  }

  private buildFormSetValue() {
    debugger;
    this.formulario.patchValue({
      codventadevolucion: this.modeloItem.codventa,
      codalmacen: this.modeloItem.codalmacen,
      nombrealmacen: this.modeloItem.nombrealmacen,
      fecventa: this.utilService.fecha_DDMMYYYYHHMM(this.modeloItem.fechaemision),
      codTipoCliente: this.modeloItem.codtipocliente,
      nombreTipoCliente: this.modeloItem.nombretipocliente,
      codAtencion: this.modeloItem.codatencion,
      paciente: this.modeloItem.codpaciente,
      codmedico: this.modeloItem.codmedico,
      nombremedico: this.modeloItem.nombremedico,
      nombreClientePaciente: this.modeloItem.nombre,
      direccion: this.modeloItem.dircliente,
      codAseguradora: this.modeloItem.codaseguradora,
      aseguradora: this.modeloItem.nombreaseguradora,
      plan: this.modeloItem.codplan,
      descuentoPlan: this.modeloItem.porcentajedctoplan,
      coaseguro: this.modeloItem.porcentajecoaseguro,
      codContratante: this.modeloItem.codcia,
      contratante: this.modeloItem.nombrecia,
      cama: this.modeloItem.cama,
      poliza: this.modeloItem.codpoliza,
      codEmpresa: this.modeloItem.codempresa,
      planPoliza: this.modeloItem.planpoliza,
      deducible: this.modeloItem.deducible
    });
}

  goVentaPorAtencionSalir() {
    this.isVisible =!this.isVisible;
  }

  goChangeCantidad(item: IVentaDetalle, index: number) {
    // Obtenermos los datos de la cabecera
    if (item.cntxdev > (item.cantidad - item.cnt_dev)) {
      swal.fire(this.globalConstants.msgInfoSummary, 'Cantidad a devolver no puede ser mayor a cantidad por devolver', 'info');
      this.listModelo[index].cntxdev = 0;
      return;
    }

    const bodyCabecera = this.formulario.getRawValue();

    let isCoaseguro = bodyCabecera.coaseguro === null ? 0 : bodyCabecera.coaseguro;

    let isPrecioUnidadConDscto: number = 0;
    let isTemp: number = 0;
    let isMontoTotal: number = 0;
    let isMontoCoaseguro: number = 0;
    let isMontoSeguro: number = 0;
    let isMontoTotalIGV: number = 0;

    isPrecioUnidadConDscto = item.valorVVP - ((item.porcentajedctoproducto/100) * item.valorVVP);

    // Solo para farmacos
    if (item.codtipoproducto === 'A') {
      isPrecioUnidadConDscto = isPrecioUnidadConDscto - ((item.porcentajedctoplan/100) * isPrecioUnidadConDscto);
    } else {
      isPrecioUnidadConDscto = isPrecioUnidadConDscto - ((item.porcentajedctoplan/100) * isPrecioUnidadConDscto);
    }

    if (item.valorVVP > 0) {
      if (item.codtipoproducto === 'A') {
        isTemp = item.cntxdev * isPrecioUnidadConDscto;
      } else {
        isTemp = item.cntxdev * isPrecioUnidadConDscto;
      }
    }

    isMontoTotal = isTemp;

    isMontoCoaseguro = isMontoTotal * (isCoaseguro/100);
    isMontoSeguro = isMontoTotal - isMontoCoaseguro;

    isMontoTotalIGV = isMontoTotal * (1 + (item.igvproducto/100));

    this.listModelo[index].preciounidadcondcto = this.utilService.onRedondearDecimal(isPrecioUnidadConDscto,2);
    this.listModelo[index].montototal = this.utilService.onRedondearDecimal(isMontoTotal,2);
    this.listModelo[index].montoaseguradora = this.utilService.onRedondearDecimal(isMontoSeguro,2);
    this.listModelo[index].montopaciente = this.utilService.onRedondearDecimal(isMontoCoaseguro,2);
    this.listModelo[index].totalsinigv = this.utilService.onRedondearDecimal(isMontoTotal,2);
    this.listModelo[index].totalconigv = this.utilService.onRedondearDecimal(isMontoTotalIGV,2);

    this.onCalcularTotales();

  }

  private onCalcularTotales() {

    const bodyCabecera = this.formulario.getRawValue();

    let isIGVTemp: number = 0;
    let isIGV: number = 0;
    let isSubTotal: number = 0;
    let isTotalPaciente: number = 0;
    let isTotalAseguradora: number = 0;

    let isSubTotal_0: number = 0;
    let isTotalPaciente_0: number = 0;
    let isTotalAseguradora_0: number = 0;

    if (this.listModelo.length > 0) {
      this.listModelo.forEach(xfila => {
        isIGV = xfila.igvproducto;

        if (isIGV > isIGVTemp) {
          isIGVTemp = isIGV; 0
        }

        if (isIGV === 0) {
          isSubTotal_0 = isSubTotal_0 + xfila.totalsinigv;
          isTotalPaciente_0 = isTotalPaciente_0 + xfila.montopaciente;
          isTotalAseguradora_0 = isTotalAseguradora_0 + xfila.montoaseguradora;
        } else {
          isSubTotal = isSubTotal + xfila.totalsinigv;
          isTotalPaciente = isTotalPaciente + xfila.montopaciente;
          isTotalAseguradora = isTotalAseguradora + xfila.montoaseguradora;
        }
      })

      isIGV = isIGVTemp;

      this.formularioTotales.patchValue({

        montoDescuentoPlan: this.utilService.onRedondearDecimal(((isSubTotal + isSubTotal_0) * (bodyCabecera.descuentoPlan/100)) ,2),

        montoSubTotal: this.utilService.onRedondearDecimal(isSubTotal + isSubTotal_0,2),
        montoIGV: this.utilService.onRedondearDecimal(isSubTotal * (isIGV/100),2),
        montoTotal: this.utilService.onRedondearDecimal(isSubTotal + isSubTotal_0 + (isSubTotal * (isIGV/100)),2),

        montoSubTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente + isTotalPaciente_0,2),
        montoSubTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora + isTotalAseguradora_0,2)
      });

    } else {
      this.formularioTotales.patchValue({

        montoDescuentoPlan: this.utilService.onRedondearDecimal((isSubTotal + isSubTotal_0) * (bodyCabecera.descuentoPlan/100),2),

        montoSubTotal: this.utilService.onRedondearDecimal(isSubTotal + isSubTotal_0,2),
        montoIGV: this.utilService.onRedondearDecimal(isSubTotal * (isIGV/100),2),
        montoTotal: this.utilService.onRedondearDecimal((isSubTotal + isSubTotal_0) + (isSubTotal * (isIGV/100)),2),

        montoSubTotalPaciente: this.utilService.onRedondearDecimal(isTotalPaciente + isTotalPaciente_0,2),
        montoSubTotalAseguradora: this.utilService.onRedondearDecimal(isTotalAseguradora + isTotalAseguradora_0,2)
      });
    }
  }
  
  goEliminarItemDetalleVenta(index: number) {
    this.listModelo.splice(+index, 1);
    this.onCalcularTotales();
  }

  goChangeVisibleProducto(event: IVentaDetalle, index: number) {
    this.isSeleccionItemVentaDetalle = event;
    this.isIndexItemVentaDetalle = index;
    this.isVisualizarProducto =!this.isVisualizarProducto; 
  }

  goSalirProducto() {
    this.isVisualizarProducto =!this.isVisualizarProducto; 
    this.isIndexItemVentaDetalle = 0;
  }

  goChangeVisibleLote(event: IVentaDetalle, index: number) {
    debugger;
    this.isSeleccionItemVentaDetalleLote = event;
    this.isIndexItemVentaDetalle = index;
    this.isVisualizarLote =!this.isVisualizarLote; 
  }

  goAceptarLote(value: IVentaDetalleLote[]) {
    debugger;
    this.isVisualizarLote =!this.isVisualizarLote; 

    this.listModelo[this.isIndexItemVentaDetalle].listVentasDetalleLotes = value;
    this.listModelo[this.isIndexItemVentaDetalle].cntxdev = 0;
    
    let isCantidadTotal: number = 0;

    value.forEach(xFila => {
      if (xFila.cantidadxdev > 0) {
        isCantidadTotal += xFila.cantidadxdev;
      }
    });

    this.listModelo[this.isIndexItemVentaDetalle].cntxdev = isCantidadTotal;

    if (isCantidadTotal === 0) {
      this.listModelo[this.isIndexItemVentaDetalle].flgbtchnum = false;
      this.listModelo[this.isIndexItemVentaDetalle].flgbin = false;
    } else {
      this.listModelo[this.isIndexItemVentaDetalle].flgbtchnum = true;
      this.listModelo[this.isIndexItemVentaDetalle].flgbin = true;
    }
    
    this.goChangeCantidad(this.listModelo[this.isIndexItemVentaDetalle], this.isIndexItemVentaDetalle);
  }

  goSalirLote() {
    this.isVisualizarLote =!this.isVisualizarLote; 
    this.isIndexItemVentaDetalle = 0;
  }

  goConfirmGrabar() {
    this.onValidacionGrabarVenta();
  }

  onValidacionGrabarVenta() {
    const bodyCabecera = this.formulario.getRawValue();

    if (bodyCabecera.tipocambio === 0 || bodyCabecera.tipocambio <= 0) {
      swal.fire(this.globalConstants.msgInfoSummary,'Ingresar el tipo de cambio: Bancario Venta','error')
      return;
    }

    let cadenaProductoCantidadCero: string = '';

    let cadenaProductoMontoCero: string = '';

    // Validamos que la cantidad y el monto del detalle no sean 0
    this.listModelo.forEach(xFila => {
      if (xFila.cntxdev === 0) {
        cadenaProductoCantidadCero = cadenaProductoCantidadCero + `Producto: ${xFila.codproducto} - ${xFila.nombreproducto} <br>`;
      }

      if (xFila.totalconigv === 0) {
        cadenaProductoMontoCero = cadenaProductoMontoCero + `Producto: ${xFila.codproducto} - ${xFila.nombreproducto} <br>`;
      }
    });

    if (cadenaProductoCantidadCero !== '') {
      swal.fire("Productos con Cantidad 0", cadenaProductoCantidadCero,'error')
      return;
    }

    if (cadenaProductoMontoCero !== '') {
      swal.fire("Productos con Monto 0", cadenaProductoMontoCero,'error')
      return;
    }

    swal.fire({
      title: 'Generar Devolución',
      text: "¿Desea Generar la Devolución?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isAutenticar =!this.isAutenticar;
      }
    })
  }

  onGeneroBodyVenta(usuario: string): INewVentaDevolucion {

    const bodyCabecera = this.formulario.getRawValue();
    const bodyTotales = this.formularioTotales.getRawValue();

    const bodyVenta: INewVentaDevolucion = {
      codalmacen: bodyCabecera.codalmacen,
      tipomovimiento: 'CD',
      codempresa: bodyCabecera.codempresa,
      codtipocliente: bodyCabecera.codTipoCliente,
      codcliente: bodyCabecera.codClienteExterno,
      codpaciente: bodyCabecera.paciente,
      nombre: bodyCabecera.nombreClientePaciente,
      cama: bodyCabecera.cama,
      codmedico: bodyCabecera.codmedico,
      codatencion: bodyCabecera.codAtencion,
      codpoliza: bodyCabecera.poliza,
      planpoliza: bodyCabecera.planPoliza,
      deducible: bodyCabecera.deducible,
      codaseguradora: bodyCabecera.codAseguradora,
      codcia:  bodyCabecera.codContratante,
      porcentajecoaseguro: bodyCabecera.coaseguro,
      porcentajeimpuesto: 18,
      montodctoplan: bodyTotales.montoDescuentoPlan,
      porcentajedctoplan: bodyCabecera.descuentoPlan,
      moneda: 'S',
      montototal: bodyTotales.montoSubTotal,
      montoigv: bodyTotales.montoIGV,
      montoneto: bodyTotales.montoTotal,
      codplan:  bodyCabecera.plan,
      montopaciente: bodyTotales.montoSubTotalPaciente,
      montoaseguradora: bodyTotales.montoSubTotalAseguradora,
      observacion:  bodyCabecera.observacion,
      codcentro:  '078',
      nombremedico:  bodyCabecera.nombremedico,
      nombreaseguradora:  bodyCabecera.aseguradora,
      nombrecia: bodyCabecera.contratante,
      codventadevolucion: bodyCabecera.codventadevolucion,
      tipocambio: bodyCabecera.tipocambio,
      codpedido: bodyCabecera.codpedido,
      nombrediagnostico: bodyCabecera.nombrediagnostico,
      flagpaquete: 'N',
      // flg_gratuito: bodyCabecera.flggratuito,
      nombremaquina: this.isNombreMaquina,
      listaVentaDetalle: this.listModelo,
      usuario: usuario,
      flgsinstock: bodyCabecera.sinStock,
      listVentasDetalleUbicacion: []
    }

    return bodyVenta;
  }

  goAutenticarAceptar(value: IAutenticarResponse) {
    this.isAutenticar =!this.isAutenticar;

    const bodyVenta = this.onGeneroBodyVenta(value.usuario);

    bodyVenta.listaVentaDetalle.forEach(xFila => {
      if (xFila.binactivat) {
        xFila.listVentasDetalleLotes.forEach(xLineaDetalleLote => {
          if (xLineaDetalleLote.cantidadxdev > 0) {

            let xExisteUbicacion = [...bodyVenta.listVentasDetalleUbicacion].filter(xLineaUbicacionExiste => 
              xLineaUbicacionExiste.ubicacion === xLineaDetalleLote.ubicacion && xLineaUbicacionExiste.codproducto === xLineaDetalleLote.codproducto 
            ).length;

            if (xExisteUbicacion > 0) {
              bodyVenta.listVentasDetalleUbicacion.find(xLineaUbicacionFind => 
                xLineaUbicacionFind.ubicacion === xLineaDetalleLote.ubicacion && xLineaUbicacionFind.codproducto === xLineaDetalleLote.codproducto 
              ).cantidad += xLineaDetalleLote.cantidadxdev;
            } else {
              bodyVenta.listVentasDetalleUbicacion.push({
                ubicacion: xLineaDetalleLote.ubicacion,
                codproducto: xFila.codproducto,
                ubicaciondescripcion: xLineaDetalleLote.ubicaciondescripcion,
                cantidad: xLineaDetalleLote.cantidadxdev
              });
            }
          }
        });
      }
    });

    let isCadenaVentaGenerado: string = '';
    let isCodVenta: string = '';
    let isCodVentaSingle: string = '';

    this.isDisplaySave = true;
    this.subscription$ = new Subscription();
    this.subscription$  = this.ventasService.setRegistrarVentaDevolucion( bodyVenta )
    .subscribe((resp: IVentaGenerado[]) =>  {

      this.isDisplaySave = false;

      this.isGrabar = true;
      isCodVenta = '';

      this.goDeshabilitarControles();

      resp.forEach(xFila => {
        isCadenaVentaGenerado = isCadenaVentaGenerado + `Ud. Genero correctamente la Devolución ${xFila.codventa} <br>`;
        if (isCodVenta === '') {
          isCodVenta = xFila.codventa;
          isCodVentaSingle = xFila.codventa;
        } else {
          isCodVenta = isCodVenta +' , ' + xFila.codventa;
        }
        
      });

      this.formulario.patchValue({
        coddevolucion: isCodVentaSingle
      });
     
      swal.fire(this.globalConstants.msgInfoSummary, isCadenaVentaGenerado, 'success');
    },
      (error) => {
        this.isDisplaySave = false;
        swal.fire(this.globalConstants.msgErrorSummary,error.error.resultadoDescripcion, 'error');
    });

  }

  goDeshabilitarControles(){
    this.formulario.controls.tipodevolucion.disable();
  }

  goAutenticarCancelar() {
    this.isAutenticar =!this.isAutenticar;
  }
  
  goVisibleNotaCredito () {
    this.isVisibleNotaCredito = !this.isVisibleNotaCredito;
  }

  goAceptarNotaCredito(){
    this.isVisibleNotaCredito = !this.isVisibleNotaCredito;
  }

  goCancelarNotaCredito() {
    this.isVisibleNotaCredito = !this.isVisibleNotaCredito;

    this.formulario.patchValue({
      tipodevolucion: '01'
    });

  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
