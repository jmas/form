export default (value, options={}, values={}) => {
    return new Promise((resolve, reject) => {
        if (options.values.indexOf(values[options.fieldName]) !== -1) {
            resolve();
        } else {
            reject();
        }
    })
};
