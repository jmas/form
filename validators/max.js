export default (value, options={}, values={}) => (
    new Promise((resolve, reject) => {
        if (String(value).length > options.size) {
            reject(`Field length can't be more then ${options.size} chars!`);
        } else {
            resolve();
        }
    })
);
