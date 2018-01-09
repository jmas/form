export default (fieldName, value, options={}, values={}) => (
    new Promise((resolve, reject) => {
        if (!value) {
            reject(`${fieldName} is not found!`);
        } else {
            resolve();
        }
    })
);
