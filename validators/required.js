export default (name, value, options={}) => (
    new Promise((resolve, reject) => {
        if (!value) {
            reject(`Field '${name}' is can't be empty!`);
        } else {
            resolve();
        }
    })
);
