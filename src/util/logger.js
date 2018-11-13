// eslint-disable-next-line no-console
const nullLoger = { log: () => {}, warning: () => {}, error: console.error };

module.exports = process.env.NODE_ENV === 'test' ? nullLoger : console;
