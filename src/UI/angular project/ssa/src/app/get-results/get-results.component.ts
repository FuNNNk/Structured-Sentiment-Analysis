import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-get-results',
  templateUrl: './get-results.component.html',
  styleUrls: ['./get-results.component.css']
})
export class GetResultsComponent implements OnInit {

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
  }
  data: any

  parser(filename) {


    this.http.get('http://localhost:3000/parser', filename).subscribe((res) => {
      console.log(res, "Started sentiment analysis...");
      this.data = res
    });
  };

  poolingResults(filename) {
    // const tm = setTimeout(()=>{
    //     window.ssa.loader("start");
    // }, 5000);

    var results = document.getElementById("rezultate")


    this.http.get('http://localhost:3000/stats', filename).subscribe((res) => {
      const sentimentResults = JSON.stringify(res, null, '\t');
      results.textContent = sentimentResults
    });

   

  }
}
