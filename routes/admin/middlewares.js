const { validationResult } = require('express-validator');

module.exports = {
    handleValidationErrors(templateFunc, onValidationFailed) {
        return async (req, res, next) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                if(onValidationFailed){
                    return res.send(templateFunc(result.errors, await onValidationFailed(req)));
                }
                return res.send(templateFunc(result.errors));
            }
            next();
        };
    },
    requireAuthentication(req, res, next) {
        if(!req.session.userId){
            return res.redirect('/signin');
        }
        next();
    },
}