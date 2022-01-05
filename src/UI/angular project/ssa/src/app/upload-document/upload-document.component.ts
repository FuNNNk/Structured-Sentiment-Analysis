import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  fileName= ''
  file:File

  onFileSelected(event) {

    const file:File = event.target.files[0];

    if (file) {

    this.fileName = file.name;
    this.file = file
    }
  
  return true
}

sendFile() {
  console.log(this.file)

  // const formData = new FormData();

  //   formData.append("file", this.file);
  //   console.log(this.file)

  //   const upload$ = this.http.post("http://localhost:3000/uiconnector", formData);

  //   upload$.subscribe();

  //   return true
}



}
