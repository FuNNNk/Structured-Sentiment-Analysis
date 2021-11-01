class Observer {
 
    public http:String

    private ListOfText:dataPrototype

    public SubscribeObserver() {

    }

    public UnsubscribeObserver() {

    }

    public NotifyObserver() {

    }

    public NotifyAllObservers() {

    }

    public GetListOfTexts(){

    }

    public constructor() {

    }

}


import { TestBed } from '@angular/core/testing';
import {expect} from 'chai'
import { Source } from "./Source"

it('should be singleton', () => {
    var dp = new dataPrototype();
    expect(dp.dataSource).to.equal('Semeval');
  });

  it('should be true', () => {
    var dp = new dataPrototype();
    expect(dp.formatedData).to.equal(true);
  });  

  let dp = new dataPrototype()

  it('should be true', () => {
    var obs = new Observer('',dp);
    expect(obs.SubscribeObserver).to.equal(true);
  });  

  it('should be true', () => {
    var obs = new Observer('',dp);
    expect(obs.NotifyObserver).to.equal(true);
  });  

  it('should be true', () => {
    var obs = new Observer('',dp);
    expect(obs.NotifyAllObservers).to.equal(true);
  });  

  it('should return list of text', () => {
    var obs = new Observer('',dp);
    expect(obs.GetListOfTexts).to.equal([]);
  });  
