class ExpressError extends Error {
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode; //member variable of the parent class
        this.message = message;
    }
}

module.exports = ExpressError;