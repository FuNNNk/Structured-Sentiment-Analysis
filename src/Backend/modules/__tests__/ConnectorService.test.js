const fs = require('fs');

const ConnectorService = require("../ConnectorService");

jest.mock('fs', () => {
    return {
        readFile: jest.fn(),
    };
});

jest.mock('path', () => {
    return {
      resolve: jest.fn(()=>"mocked/path"),
    };
});

const path = require('path');


describe('Teste ConnectorService reader', () => {
  
    describe('ConnectorService.getAIConnectorStats: test serviciu de citire date', () => {
      
     test('Test getAIConnectorStats returneaza modulul de citire fisier', () => {
        const reader = ConnectorService.getAIConnectorStats("sample.txt");
        const readerModule = {
            read: reader
        }

        const spy = jest.spyOn(readerModule, 'read');
        readerModule.read();
        expect(spy).toHaveBeenCalled();
      });

      test('Test reader returneaza valoarea prestabilita inainte de citire fisier', () => {
        const reader = ConnectorService.getAIConnectorStats("unit_test");
        const fileContent = reader();
        expect("no data").toEqual(fileContent);
      });

      test('Test reader cheama path resolver pt a compune calea spre fisierul cu date', () => {
        const reader = ConnectorService.getAIConnectorStats("unit_test");
        reader();
        expect(path.resolve).toBeCalled();
        expect(path.resolve).toBeCalledWith(expect.stringContaining("Backend\\modules"), expect.stringContaining("data-upload-storage/unit_test_result"));
      });

      test('Test getAIConnectorStats reader ', () => {
        const reader = ConnectorService.getAIConnectorStats("unit_test");
        reader();

        expect(fs.readFile).toBeCalled();
        expect(fs.readFile).toBeCalledWith(expect.stringContaining("mocked/path"), expect.stringContaining("utf8"), expect.any(Function) );
      });
    });
});