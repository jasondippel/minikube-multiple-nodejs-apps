const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000
const HOST = "0.0.0.0" // Important to specify this rather than localhost (won't work in containers)
const VILLAINS_SERVICE = process.env.VILLAINS_SERVICE || 'http://localhost:3001';

const app = express();
app.use(bodyParser.json());

const heroes = [
  {
      id: 1,
      displayName: 'Spider-Man',
      busy: false,
      assignedVillain: undefined,
  },
  {
      id: 2,
      displayName: 'Wonder Woman',
      busy: false,
      assignedVillain: undefined,
  },
  {
      id: 3,
      displayName: 'Green Lantern',
      busy: false,
      assignedVillain: undefined,
  },
  {
      id: 4,
      displayName: 'Batman',
      busy: false,
      assignedVillain: undefined,
  }
];

app.get('/heroes', (req, res) => {
  console.log('Returning heroes list');
  res.send(heroes);
});

app.post('/assignment', (req, res) => {
  const heroId = parseInt(req.body.heroId);
  const villainId = parseInt(req.body.villainId);

  const hero = heroes.find(h => h.id === heroId);
  if (!hero) {
    return res.status(404).send({ message: `Hero ${heroId} not found`});
  }

  fetch(`${VILLAINS_SERVICE}/assignment`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      heroId: heroId,
      villainId: villainId,
    }),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Received ${response.status} from villains service`);
    }
  })
  .then(() => {
    hero.assignedVillain = villainId;
    hero.busy = true;
    res.status(200).send(hero);
  })
  .catch(error => {
    console.log('POST /assignment Error:', error);
    res.status(400).send(error);
  });
});

app.post('/clear-assignment', (req, res) => {
  const heroId = parseInt(req.body.heroId);

  const hero = heroes.find(h => h.id === heroId);
  if (!hero) {
    return res.status(404).send({ message: `Hero ${heroId} not found`});
  }
  if (!hero.busy) {
    return res.status(200).send({ message: `Hero ${heroId} not assigned to villain`, hero })
  }

  fetch(`${VILLAINS_SERVICE}/clear-assignment`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      villainId: hero.assignedVillain,
    }),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Received ${response.status} from villains service`);
    }
  })
  .then(() => {
    hero.assignedVillain = undefined;
    hero.busy = false;
    res.status(200).send(hero);
  })
  .catch(error => {
    console.log('POST /clear-assignment Error:', error);
    res.status(400).send(error);
  })

});

app.listen(PORT, HOST);
console.log(`Heroes service listening on ${HOST}:${PORT}`);
