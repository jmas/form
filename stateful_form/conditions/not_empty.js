export default (value, options={}, values={}) => {
    return new Promise((resolve, reject) => {
        if (values[options.fieldName]) {
            resolve();
        } else {
            reject();
        }
    })
};
