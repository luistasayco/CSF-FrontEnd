import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';

@NgModule({
  exports: [
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SplitButtonModule
  ],
})
export class RequerimientoCompartidoPrimeNgModule {}
