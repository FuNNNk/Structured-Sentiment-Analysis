
const ServerManager = require('../modules/ServerManager')
const InputDataProcessing = require('../modules/InputDataProcessing')
const InputDataReceiver = require('../modules/InputDataReceiver')
const OutputDataSender = require('../modules/OutputDataSender')
const expect = require('chai').expect

it('should be singleton', () =>{
    expect(ServerManager.ServerManager.getInstance()).to.equal(true);
})

it('should be true', () =>{
    var sm = new ServerManager.ServerManager()
    expect(sm.AIConnector()).to.equal(true);
})

it('should return text', () =>{
    var idr = new InputDataReceiver.InputDataReceiver();
    expect(idr.getText()).to.equal('');
});

it('should be true', () =>{
    var idr = new InputDataReceiver.InputDataReceiver();
    expect(idr.getJsonFile()).to.equal(true);
});

it('should be true', () =>{
    var idr = new InputDataReceiver.InputDataReceiver();
    expect(idr.getTextFile()).to.equal(true);
});

it('should return text', () =>{
    var idp = new InputDataProcessing.InputDataProcessing();
    expect(idp.transformText()).to.equal('');
});

it('should be true', () =>{
    var idp = new InputDataProcessing.InputDataProcessing();
    expect(idp.transformTextFile()).to.equal(true);
});

it('should be true', () =>{
    var ods = new OutputDataSender.OutputDataSender();
    expect(ods.sendJsonFile()).to.equal(true);
});

it('should be true', () =>{
    var ods = new OutputDataSender.OutputDataSender();
    expect(ods.sendText()).to.equal(true);
});

it('should be true', () =>{
    var ods = new OutputDataSender.OutputDataSender();
    expect(ods.sendTextFile()).to.equal(true);
});