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


//async tests

it('subscribed to Observer', (done) => { (1)
    obs = TestBed.createComponent(Observer)
    obs.detectChanges();
    expect(obs.SubscribeObserver).toBe(false);
    let spy = spyOn(obsService, 'isObserved').and.returnValue(Promise.resolve(false));
    observerComponent.ngOnInit();
    spy.calls.mostRecent().returnValue.then(() => { (2)
      obs.detectChanges();
      expect(obs.SubscribeObserver).toBe(true);
      done(); (3)
    });
  });

  it('notify observer', async(() => { (1)
    obs = TestBed.createComponent(Observer)
    obs.detectChanges();
    expect(obs.NotifyObserver).toBe(false);
    spyOn(obsService, 'isNotified').and.returnValue(Promise.resolve(true));
    fixture.whenStable().then(() => { (2)
      fixture.detectChanges();
      expect(obs.NotifyObserver).toBe(true);
    });
    observerComponent.ngOnInit();
  }));

