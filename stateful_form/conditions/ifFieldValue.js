export default (value, options={}, values={}) => {
    return new Promise((resolve, reject) => {
        switch (options.condition) {
            case 'notEmpty':
                if (values[options.fieldName]) {
                    resolve();
                } else {
                    reject();
                }
                break;
            case 'in':
                if (options.inValues.indexOf(values[options.fieldName]) !== -1) {
                    resolve();
                } else {
                    reject();
                }
                break;
            default:
                reject();
                break;
        }
    })
};
