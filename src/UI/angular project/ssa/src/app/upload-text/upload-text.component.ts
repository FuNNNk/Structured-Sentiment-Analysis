import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-text',
  templateUrl: './upload-text.component.html',
  styleUrls: ['./upload-text.component.css']
})
export class UploadTextComponent implements OnInit {

  constructor(public http:HttpClient) { }

  // onEditButtonClick(){
  //   console.log('button clicked');
  // } 

  text: string
  ngOnInit(): void {
    this.text=''
  }


  uploadText() {
    // this.text =  document.getElementById('textArea').value
    console.log(this.text)

    var file = new Blob([this.text], {type: 'text/plain'});

    const formData = new FormData();


    formData.append("file", file);
    console.log(file)

    // const upload$ = this.http.post("http://localhost:3000/uiconnector", formData);


    // upload$.subscribe();
    this.http.post('http://localhost:3000/uiconnector', formData).subscribe((res)=>{
            console.log(res);
        });

    return true


  }


}
