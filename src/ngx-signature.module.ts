import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSignatureComponent } from './ngx-signature/ngx-signature.component';
import { ImageCropperModule } from 'ngx-image-cropper';
@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule,
  ],
  declarations: [
    NgxSignatureComponent
  ],
  exports: [
    NgxSignatureComponent
  ]
})
export class NgxSignatureModule { }
