//libreria
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';//JC
import { Location } from '@angular/common';
// import { map } from 'rxjs/operators';
import { VentasCajaService } from '../../../services/ventas-caja.service';


//constante
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { ConstantesGenerales } from '../../../../../constants/Constantes-generales';

//services
import { SessionService } from '../../../../../services/session.service';
import { LanguageService } from '../../../../../services/language.service';
import { MensajePrimeNgService } from '../../../../../services/mensaje-prime-ng.service';
import { UserContextService } from '../../../../../services/user-context.service';
import { UtilService } from '../../../../../services/util.service';
import swal from 'sweetalert2';

//Interface

@Component({
  selector: 'app-generar-pagobot',
  templateUrl: './generar-pagobot.component.html',
  styleUrls: ['./generar-pagobot.component.css']
})

export class GenerarPagoBotComponent implements OnInit {
  formularioSuperior: FormGroup;
  // Suscripcion [para realizar el unsuscription al cerrar el formulario]
  subscription$: Subscription;

  @Input() isHabilitaControl = false;
  @Input() codVenta : string = "";
  @Output() cancel = new EventEmitter<any>();

  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();
  timeAnimationModal = ConstantesGenerales.DURACION_ANIMACION_MODAL;


  bodyParams: any;

  loading = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly activeRoute: ActivatedRoute,
    public lenguageService: LanguageService,
    public mensajePrimeNgService: MensajePrimeNgService,
    public userContextService: UserContextService,
    private readonly location: Location,
    private readonly sessionStorage: SessionService,
    private messageService: MessageService,
    private readonly utilService: UtilService,
    private readonly ventasCajaService: VentasCajaService) { }

  ngOnInit(): void {

    this.buildFormSuperior();
    this.consultarPago();    

  }

  private buildFormSuperior() {

    this.formularioSuperior = this.fb.group({
      idPago: '',
      codVenta: '',
      tipoPago: 'PAGOS DE MEDICAMENTOS DE FARMACIA',
      nombre: '',
      apellidos: '',
      telefono: '',
      correo: '',
      tipoDocumento: '',
      numeroDocumento: '',
      descripcionPago: '',
      urlImagen: ''
    });

  }

  consultarPago() {

    console.log(this.consultarPago);

    var flgSeguiPago = false;

    this.ventasCajaService
      .getGetMdsynPagosConsulta("0","0","0","",this.codVenta,"2")
      .subscribe(
        (resp: any) => {
         
          console.log("getGetMdsynPagosConsulta")
          console.log(resp)

          this.formularioSuperior.patchValue({
            codVenta:this.codVenta,
            nombre: resp.cust_name,
            apellidos: resp.cust_lastname,
            telefono: resp.cust_phone,
            correo: resp.cust_email,
            tipoDocumento: resp.cust_doc_type,
            numeroDocumento: resp.cust_doc_number,
            descripcionPago:resp.products_name
          });

        },
        (error) => {
          this.messageService.add({ key: 'toasVentaCaja', severity: 'error', summary: 'Mensaje', detail: error.error.resultadoDescripcion });
          console.log(error);
        }
      );
  }

  

}
