import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { ViewChild } from '@angular/core';
import * as SignaturePad from 'signature_pad';
import * as fx from 'glfx-es6'

declare const $;

@Component({
  selector: 'ngx-signature',
  templateUrl: './ngx-signature.component.html',
  styleUrls: ['./ngx-signature.component.css']
})
export class NgxSignatureComponent implements OnInit {
  dragging:boolean = false;
  selected:boolean = false;
  uploadFileChangedEvent;
  capturedImage;
  croppedImage;

  responseImage;
  @ViewChild('fileUpload') fileInputField;
  @ViewChild('signaturePad') signaturePadCanvas;
  @ViewChild('camera') cameraElement;
  @ViewChild('cameraSnapshot') cameraSnapshotCanvas;

  signaturePad;
  videoStream;
  constructor() { }

  ngOnInit() {

    this.signaturePad = new SignaturePad.default(this.signaturePadCanvas.nativeElement);
    $('#ngx-modal').on('hidden.bs.modal',  () => {
      this.resetModal();
    }); 
    $('#ngx-modal').on('show.bs.modal',  () => {
      $("a[href='#draw']").click();
    }); 
  }

  @HostListener('dragover', ['$event']) onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    this.dragging = true;
    
  }
  @HostListener('dragleave', ['$event']) onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.dragging = false;
  }
  @HostListener('drop', ['$event']) public onDrop(evt){
    this.dragging = false;
    console.log(evt);
  }


  uploadFileChange(e) {
    if(this.validateFiles(e.target.files)){
      this.selected = true;
      this.uploadFileChangedEvent = e;
    }
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
      // show cropper
  }
  loadImageFailed() {
      // show message
  }

  validateFiles(files){
    if(files.length){
        for(var i = 0 ; i < files.length; i++){
            if(!(files[i].type.match('image'))){
                alert('Invalid file! Only images are allowed.');
                return false;
            }
            if( ((files[i].size/1024)/1024) > 5){
                alert('Invalid file! File size exceeds 5 MB.');
                return false;
            }
        }
    }
    return true;
  }

  doneCropping(){
    this.responseImage = this.croppedImage;
    $("#ngx-modal").modal('hide');
  }

  doneDrawing(){
    this.responseImage = this.signaturePad.toDataURL();
    $("#ngx-modal").modal('hide');
  }


  clearDrawing(){
    if(this.signaturePad && this.signaturePad.clear){
      this.signaturePad.clear();
    }
  }

  resetModal() {
    //Clear Drawing section
    this.clearDrawing();
    //Clear Upload Section
    this.uploadFileChangedEvent = null
    this.croppedImage = null;
    this.selected = false;
    //Clear snap section
    this.stopVideoStream();
  }

  stopVideoStream(){
    if(this.videoStream && this.videoStream.getTracks){
      var tracks = this.videoStream.getTracks();
      for(var i in tracks){
        if(tracks[i] && tracks[i].stop){
          tracks[i].stop();
        }
      }
    }
    if(this.cameraElement && this.cameraElement.nativeElement) {
      this.cameraElement.nativeElement.src = ""
      if(this.cameraElement.nativeElement.pause) {
        this.cameraElement.nativeElement.pause();
      }
    }

  }

  activateDrawTab() {
    this.resetModal();
  }

  activateCameraTab() {
    this.resetModal();
    
    var browser = <any>navigator;
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia({video : true, audio : false}).then(stream => {
      this.videoStream = stream;
      this.cameraElement.nativeElement.src = window.URL.createObjectURL(stream);
      this.cameraElement.nativeElement.play();
    });
  }

  activateUploadTab() {
    this.resetModal();
  }

  takeSnapshot(){
    this.cameraSnapshotCanvas.nativeElement.getContext('2d').drawImage(this.cameraElement.nativeElement, 0, 0, this.cameraSnapshotCanvas.nativeElement.width, this.cameraSnapshotCanvas.nativeElement.height);
    this.stopVideoStream();
    this.selected = true;
    var c = fx.canvas();
    var texture = c.texture(this.cameraSnapshotCanvas.nativeElement);
    c.draw(texture)
            .hueSaturation(-1, -1)//grayscale
            .unsharpMask(20, 2)
            .brightnessContrast(0.2, 0.9)
            .update();
    console.log(c);

    this.capturedImage = c.toDataURL();
    
  }

  retakeSnapshot() {
    this.resetModal();
    this.activateCameraTab();
  }
}
