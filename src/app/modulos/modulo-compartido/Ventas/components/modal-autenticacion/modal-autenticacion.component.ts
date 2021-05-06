import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalsConstantsForm } from '../../../../../constants/globals-constants-form';
import { LoginModel } from '../../../../modulo-login/models/login.model';
import { LoginService } from '../../../../modulo-login/services/login.service';
import { CifrarDataService } from '../../../../../services/cifrar-data.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-autenticacion',
  templateUrl: './modal-autenticacion.component.html',
  styleUrls: ['./modal-autenticacion.component.css']
})
export class ModalAutenticacionComponent implements OnInit, OnDestroy {
  // Variables globales
  globalConstants: GlobalsConstantsForm = new GlobalsConstantsForm();

  @Input() isAnular: boolean;
  @Output() eventoAceptar= new EventEmitter<any>();
  @Output() eventoCancelar = new EventEmitter<any>();

  formularioAutenticacion: FormGroup;

  subscription$: Subscription;
  constructor(private readonly fb: FormBuilder,
              private loginService: LoginService,
              private readonly cifrarDataService: CifrarDataService,
              public readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.formularioAutenticacion = this.fb.group({
      usuario: new FormControl('', Validators.compose([Validators.required])),
      contrasena: new FormControl('', Validators.compose([Validators.required])),
      motivo:  new FormControl('')
    });
  }

  goAutenticar() {
    const formBody = this.formularioAutenticacion.value;

    let modeloLogin = new LoginModel();
    modeloLogin.usuario = formBody.usuario;
    modeloLogin.clave = this.cifrarDataService.encrypt(formBody.contrasena);

    this.subscription$ = new Subscription();
    this.subscription$ = this.loginService.autenticaUsuario(modeloLogin)
    .subscribe((data: boolean) => {
      console.log({valid: data, motivo: formBody.motivo});
      this.eventoAceptar.emit({valid: data, motivo: formBody.motivo});
    },
    (error) => {
      this.eventoAceptar.emit({valid: false});
      this.messageService.add({severity:'error', summary: this.globalConstants.msgErrorSummary, detail: error.error.resultadoDescripcion});
    });
  }

  goCancelar() {
    this.formularioAutenticacion.reset();
    this.eventoCancelar.emit({valid: false});
  }
  
  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
