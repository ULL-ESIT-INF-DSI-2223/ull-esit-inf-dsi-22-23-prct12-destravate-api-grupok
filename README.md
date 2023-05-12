# Práctica 12 - Destravate: API Node/Express - Grupo K

Esta práctica consiste en desarrollar una API REST con Node.js y Express para la aplicación Destravate. Esta API se encargará de gestionar los datos de la aplicación, ofreciendo todas las operaciones CRUD, almacenándolos en una base de datos MongoDB, implementado utilizando mongoose.

## Funcionalidad de la API

La API debe ofrecer distintas funcionalidades, para los distintos puntos de acceso o rutas de esta. La api se basa en el seguimiento de actividades deportivas, por lo que se ofrecerán funcionalidades para gestionar usuarios, grupos, retos y rutas. Para cada uno de estos elementos se ofrecerán las operaciones CRUD. Algo común en todos es que la operación de lectura 

- Editar Typedoc
- Workflow ignorados (los tiene Aday en su pc)
- Entry points de la documentación

- levantar servidor mongodb:  sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/
- levantar servidor express: npm run dev (de momento)
- Para los test: npm run test


TRABAJO QUE FALTA (CÓDIGO)
- Ver que hacer con el ranking de group
- Linkear todo


User:
{
  "name": "Aday2",
  "activity": "running",
  "friends": ["645d342cf4d742296183ddb2"],
  "groups": [],
  "trainingStatistics": {
    "week": { "km": 10, "elevationGain": 100},
    "month": { "km": 20, "elevationGain": 200},
    "year": { "km": 50, "elevationGain": 500}
  },
  "favouriteTracks": ["645d33c8f4d742296183ddaf"],
  "tracksHistory": [ 
    {
      "track": "645d33c8f4d742296183ddaf",
      "date": "1987-09-28"
    }],
  "activeChallenges": ["645d33aff4d742296183ddad"]
}

Groups:

{
 "name": "GrupoAday",
 "groupStatistics": {
    "week": {
      "km": 10,
      "elevationGain": 100
    },
    "month": {
      "km": 20,
      "elevationGain": 200
    },
    "year": {
      "km": 50,
      "elevationGain": 500
    }
  },
  "members": ["645ccf402d45736f7d2cfdb1"],
  "favouriteTracks": []
}


Challenge:
{
  "name": "Ironman",
  "tracks": [],
  "activity": "running",
  "length": 45,
  "users": []
}


Track:
{
  "name": "Ironman",
  "startCoordinates": [12,12],
  "endCoordinates": [23,25],
  "length": 44,
  "grade": 6,
  "users":[],
  "activity": "running",
  "rating": 4.3
}