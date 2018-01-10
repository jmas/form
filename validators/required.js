export default (name, value, options={}) => (
    new Promise((resolve, reject) => {
        if (!value) {
            reject(`Field '${name}' can't be empty!`);
        } else {
            resolve();
        }
    })
);
