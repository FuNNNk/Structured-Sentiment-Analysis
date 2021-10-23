import InputDataReceiver from "./InputDataReceiver";
import OutputDataSender from "./OutputDataSender";

export default class ServerManager{
    static #privateInstance;
    inputDataReceiver;
    outputDataSender;
    inputDataProcessing;
    ServerManager();
    AIConnector();
    static getInstance(); // Singleton server
}