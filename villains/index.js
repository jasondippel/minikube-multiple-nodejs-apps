const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0" // Important to specify this rather than localhost (won't work in containers)
const app = express();

app.use(bodyParser.json());

const villains = [
  {
      id: 1,
      displayName: 'Joker',
      busy: false,
      assignedHero: undefined,
  },
  {
      id: 2,
      displayName: 'Loki',
      busy: false,
      assignedHero: undefined,
  },
  {
      id: 3,
      displayName: 'Magneto',
      busy: false,
      assignedHero: undefined,
  }
];

app.get('/villains', (req, res) => {
  console.log('Returning villains list');
  res.send(villains);
});

app.post('/assignment', (req, res) => {
  const heroId = parseInt(req.body.heroId);
  const villainId = parseInt(req.body.villainId);
  const villain = villains.find(v => v.id === villainId);
  if (!villain) {
    return res.status(404).send({ message: `Villain ${villainId} not found`});
  }

  villain.assignedHero = heroId;
  villain.busy = true;

  res.status(202).send(villain);
});

app.post('/clear-assignment', (req, res) => {
  const villainId = parseInt(req.body.villainId);
  const villain = villains.find(v => v.id === villainId);
  if (!villain) {
    return res.status(404).send({ message: `Villain ${villainId} not found`});
  }

  villain.assignedHero = undefined;
  villain.busy = false;

  res.status(202).send(villain);
});

app.listen(PORT, HOST);
console.log(`Villains service listening on ${HOST}:${PORT}`);
