const Gpio = require('onoff').Gpio;
const actuartorConst = require('../constants/actuator');

class Actuator {
    constructor(actuatorModelObj) {

        this.model = actuatorModelObj;                                              // Structure as Actuator Schema/Model
        this.hardware = new Gpio(this.model.pinout.pin, this.model.pinout.kind);    // Gpio creation
    }

    get id(){
        return this.model._id;
    }

    get modelObj() {
        return this.model;
    }

    get hardwareObj() {
        return this.hardware;
    }

    _activeFiler(){
        if(!this.model.active){
            // Si l'actuador no està actiu, throw error
            throw "This actuator is not currently active";
        }
    }

    writeStatus(value, callback) {

        // asyncronous mode -- no funciona
        /*
        this.hardware.write(value, (err, val, callback) =>{
            if(err) throw err;

            this.hardware.read((err, val, callback) =>{
                if(err) throw err;
                this.model.status = val;
                callback();
            });
        });*/
        

        /* Sync Mode*/

        this._activeFiler();        

        this.hardware.writeSync(value);
        this.model.status = this.hardware.readSync();
        
    }

    toggleStatus() {

        this._activeFiler();

        if (this.model.kind !== actuartorConst.kind.toggle) {
            throw "This device cannot perform a toggle action"
        }

        if (this.model.status === 1){
            this.hardware.writeSync(0);
        } else {
            this.hardware.writeSync(1);
        }
        this.model.status = this.hardware.readSync();
    }

    get status() {
        return this.model.status;
    }
}

module.exports = Actuator