import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {

  constructor(public http:HttpClient ) { }



  ngOnInit(): void {
  }

  fileName= ''
  file:File
  // http:HttpClient

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

  const formData = new FormData();

    formData.append("file", this.file);
    console.log(this.file)

    // const upload$ = this.http.post("http://localhost:3000/uiconnector", formData);


    // upload$.subscribe();
    this.http.post('http://localhost:3000/uiconnector', formData).subscribe((res)=>{
            console.log(res);
        });

    return true
}



}
