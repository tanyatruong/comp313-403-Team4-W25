import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';

@NgModule({
  declarations: [],
  imports: [
    // CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    DialogModule,
    MessageModule,
    SidebarModule,
    TableModule,
    FileUploadModule,
    ToastModule,
    CardModule,
    CheckboxModule,
    ImageModule,
    DropdownModule,
    FloatLabelModule,
  ],
  exports: [
    ToastModule,
    FileUploadModule,
    ConfirmDialogModule,
    ButtonModule,
    DialogModule,
    MessageModule,
    SidebarModule,
    TableModule,
    CardModule,
    CheckboxModule,
    ImageModule,
    DropdownModule,
    FloatLabelModule,
  ],

  providers: [MessageService],
})
export class PrimengModule {}
