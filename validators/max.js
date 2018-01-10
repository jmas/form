export default (name, value, options={}) => (
    new Promise((resolve, reject) => {
        if (String(value).length > options.size) {
            reject(`Field '${name}' length can't be more then ${options.size} chars!`);
        } else {
            resolve();
        }
    })
);
