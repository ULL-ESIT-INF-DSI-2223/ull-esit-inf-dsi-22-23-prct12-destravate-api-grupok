[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/GwypoZrl)


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
  "name": "Aday",
  "activities": "running",
  "friends": [],
  "groups": [],
  "trainingStatistics": {
    "week": { "km": 10, "elevationGain": 100},
    "month": { "km": 20, "elevationGain": 200},
    "year": { "km": 50, "elevationGain": 500}
  },
  "favouriteTracks": [],
  "tracksHistory": [],   // id, "1987-09-28"
  "activeChallenges": []
}

Groups:
{
  "name": "Secta",
  "activities": "running",
  "members": [],
  "groups": [],
  "groupStatistics": {
    "week": { "km": 10, "elevationGain": 100},
    "month": { "km": 20, "elevationGain": 200},
    "year": { "km": 50, "elevationGain": 500}
  },
  "favouriteTracks": [],
  "tracksHistory": [],   // id, "1987-09-28"
  "activeChallenges": []
}

Challenge:
{
  "name": "Ironman",
  "tracks" [],
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
  "activities": "running",
  "rating": 4.3
}