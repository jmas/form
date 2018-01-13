export default (value, options={}, values={}) => (
    new Promise((resolve, reject) => {
        if (!value) {
            reject(`Field can't be empty!`);
        } else {
            resolve();
        }
    })
);
