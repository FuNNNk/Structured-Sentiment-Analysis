class Observer {
 
    public link:String

    private ListOfTexts:dataPrototype

    public SubscribeObserver() {

        return true

    }

    public UnsubscribeObserver() {

        return true

    }

    public NotifyObserver() {

        return true

    }

    public NotifyAllObservers() {

        return true

    }

    public GetListOfTexts(){

        return []

    }

    public constructor(link:String, ListOfTexts:dataPrototype) {
        this.link = link
        this.ListOfTexts = ListOfTexts

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

  let dp = TestBed.createComponent(dataPrototype)

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
