const { validationResult } = require('express-validator');

module.exports = {
    handleValidationErrors(templateFunc) {
        return (req, res, next) => {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                //console.log(result.errors);
                return res.send(templateFunc(result.errors));
            }
            next();
        };
    },
}