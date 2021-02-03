module.exports = {
    getValidationError(errors, param) {
        if(errors){
            const error = errors.find(x => x['param'] === param);
            if(error) return error.msg;
        }
        return '';
    },
};