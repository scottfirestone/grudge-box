const EventEmitter = require('events');

let grudges = [];

const store = new EventEmitter();

const storedGrudges = localStorage.getItem('grudges');

if (storedGrudges) { grudges = JSON.parse(storedGrudges); }

store.all = () => grudges.concat([]);

store.create = ({ person, grudge }) => {
  grudges = grudges.concat({ person, grudge, forgiven: false, active: false, id: Date.now() });
  store.emit('change', grudges);
};

store.forgive = (id) => {
  grudges = grudges.map(grudge => {
    if (grudge.id == id) {
      grudge.forgiven = true;
    }
    return grudge;
  });
  store.emit('change', grudges);
};

store.forgiven = () => {
  return grudges.filter(grudge => grudge.forgiven === true).length;
};

store.unforgiven = () => {
  return grudges.filter(grudge => grudge.forgiven === false).length;
};

store.on('change', () => {
  localStorage.setItem('grudges', JSON.stringify(grudges));
});

module.exports = store;
