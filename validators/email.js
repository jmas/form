const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default (name, value, options={}) => (
    new Promise((resolve, reject) => {
        if (!emailPattern.test(value)) {
            reject(`Field '${name}' should be email formatted!`);
        } else {
            resolve();
        }
    })
);
