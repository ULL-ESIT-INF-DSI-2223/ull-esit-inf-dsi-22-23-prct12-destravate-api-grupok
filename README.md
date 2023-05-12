# Práctica 12 - Destravate: API Node/Express - Grupo K

Esta práctica consiste en desarrollar una API REST con Node.js y Express para la aplicación Destravate. Esta API se encargará de gestionar los datos de la aplicación, ofreciendo todas las operaciones CRUD, almacenándolos en una base de datos MongoDB, implementado utilizando mongoose.

## Funcionalidad de la API

La API debe ofrecer distintas funcionalidades, para los distintos puntos de acceso o rutas de esta. La api se basa en el seguimiento de actividades deportivas, por lo que se ofrecerán funcionalidades para gestionar usuarios, grupos, retos y rutas. Para cada uno de estos elementos se ofrecerán las operaciones CRUD. Algo común en todos es que la operación de consulta, modificación y borrado se puede realizar de dos formas, o bien utilizando una query string por el nombre de lo que se consulte, o bien utilizando el id único de dicho elemento como parametro de la ruta de acceso.

* http://localhost:3000/userss?name=ejemplo -> Consulta de usuarios por nombre
* http://localhost:3000/userss/5f9e9b0a1c9d440000d1b0b0 -> Consulta de usuarios por id único

### Track

Las operaciones con las rutas (deportivas) se realizarán a través de la ruta /tracks, utilizando los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). Estas rutas se caracterizan por tener los siguientes atributos o información:

* ID único de la ruta (valor generado automáticamente por el sistema).
* Nombre de la ruta.
* Geolocalización del inicio (coordenadas).
* Geolocalización del final de la ruta (coordenadas).
* Longitud de la ruta en kilómetros.
* Desnivel medio de la ruta.
* Usuarios que han realizado la ruta (IDs).
* Tipo de actividad: Indicador si la ruta se puede realizar en bicicleta o corriendo.
* Calificación media de la ruta.

### User

Las operaciones con los usuarios se realizarán a través de la ruta /users, utilizando los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). Estos usuarios se caracterizan por tener los siguientes atributos o información:

* ID único del usuario (valor generado automáticamente por el sistema).
* Nombre del usuario.
* Actividades que realiza: Correr o bicicleta.
* Amigos en la aplicación: Colleción de IDs de usuarios con los que interacciona.
* Grupos de amigos: Diferentes colecciones de IDs de usuarios con los que suele realizar rutas.
* Estadísticas de entrenamiento: Cantidad de km y desnivel total acumulados en la semana, mes y año.
* Rutas favoritas: IDs de las rutas que el usuario ha realizado con mayor frecuencia.
* Retos activos: IDs de los retos que el usuario está realizando actualmente.
* Histórico de rutas: Los usuarios deben almacenar el historial de rutas realizadas desde que se registraron en el sistema. La información almacenada en esta estructura de datos deberá contener la información de la fecha y el ID de la ruta realizada. Nótese que un usuario puede realizar más de una ruta al día y está decisión puede afectar al tipo de estructura en el que se almacena la información.

### Group

Las operaciones con los grupos se realizarán a través de la ruta /groups, utilizando los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). Estos grupos se caracterizan por tener los siguientes atributos o información:

* ID único del grupo (valor generado automáticamente por el sistema).
* Nombre del grupo.
* Participantes: IDs de los miembros del grupo.
* Estadísticas de entrenamiento grupal: Cantidad de km y desnivel total acumulados de manera grupal en la semana, mes y año
* Clasificación de los usuarios: Ranking de los usuarios que más entrenamientos han realizado históricamente dentro del grupo, es decir, ordenar los usuarios por la cantidad de km totales o desnivel total que han acumulado.
* Rutas favoritas del grupo: Rutas que los usuarios del grupo han realizado con mayor frecuencia en sus salidas conjuntas.
* Histórico de rutas realizadas por el grupo: Información similar que almacenan los usuarios pero en este caso referente a los grupos. Nótese que un usuario puede realizar rutas con un grupo y/o de manera individual el mismo día. Es decir, a modo de simplificación, asumimos que todos los usuarios de un grupo realizan la actividad cuando se planifica. Aunque, también pueden realizar otras actividades de manera individual.

### Challenge

Las operaciones con los retos se realizarán a través de la ruta /challenges, utilizando los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). Estos retos se caracterizan por tener los siguientes atributos o información:

* ID único del reto (valor generado automáticamente por el sistema).
* Nombre del reto.
* Rutas que forman parte del reto.
* Tipo de actividad del reto: bicicleta o correr.
* Km totales a realizar (como la suma de los kms de las rutas que lo engloban).
* Usuarios que están realizando el reto.

## Implementación y estructura de la API REST

Lo primero a comentar es la organización y estructura del código, dentro de la carpeta src/ se encuentra todo el código fuente del proyecto, hemos decidido crear un directorio para cada grupo de ficheros relacionados para una mejor organización. En este caso, tenemos los siguientes directorios:

* enums: En este directorio se encuentran los enumerados que se utilizan en la api.
* interfaces: En este directorio se encuentran las interfaces que se utilizan en la api.
* models: En este directorio se encuentran los modelos de datos que se utilizan en la api.
* routes: En este directorio se encuentran los directorios para cada una de las rutas de la api.
* db: En este directorio se encuentran los ficheros relacionados con la base de datos. 

En cuanto a esta última carpeta, db/, se encuentran los ficheros relacionados con la base de datos. En este caso solo es uno, llamado `mongoose.ts` en este simplemente se realiza la conexión con la base de datos.

Además de todo esto, hay dos ficheros más en la raíz del proyecto, `app.ts` y `index.ts`. En el primero se encuentra la configuración del servidor express, en este caso lo único que hay son las distintas rutas de la api que se utilizan. En el segundo se encuentra el punto de entrada de la aplicación, es decir donde se inicia el servidor express para que escuche peticiones a traves del puerto determinado.

El puerto a utilizar se determina según el entorno en el que se ejecute la aplicación, la configuración de estos entornos se encuentra en los distintos ficheros `.env` que se encuentran en la carpeta 'config/' en la raíz del proyecto. En estos ficheros se encuentran las variables de entorno que se utilizan en la aplicación, en este caso solo tenemos el puerto y la url de conexión a la base de datos.

Ahora se comentará cada uno de los ficheros dentro de los directorios comentados anteriormente.

### Enums
#### activityEnum.ts

Este enumerado es simplemente para los tipos de actividades que tienen las rutas, estos son solo dos, correr y bicicleta, que los hemos representado en ingles como running y cycling. 

```typescript	
export enum ActivityEnum {
  running = 'running',
  cycling = 'cycling',
}
```

Simplemente se utiliza para que el usuario no pueda introducir otro tipo de actividad que no sea una de estas dos.

### Interfaces
#### HistoryInterface

Esta interfaz es para el histórico de rutas de los usuarios y grupos, como se ha comentado anteriormente, esta interfaz tiene dos atributos, el id de la ruta y la fecha en la que se realizó.

```typescript
export interface HistoryData {
  track: Schema.Types.ObjectId;
  date: Date;
}
```

Vemos que el id de la ruta es de tipo `Schema.Types.ObjectId`, esto es porque en la base de datos se almacena como un id único de tipo `ObjectId`, que es un tipo de dato que proporciona mongoose para identificar de manera única los documentos de la base de datos.

#### TrainingStatisticsInterface

Esta interfaz es para las estadísticas de entrenamiento de los usuarios y grupos, como se ha comentado anteriormente, esta interfaz tiene tres atributos, uno para las estadísticas de la semana, otro para las del mes y otro para las del año. Cada uno de estos atributos tiene dos atributos, uno para los kilómetros y otro para el desnivel acumulado.

```typescript
export interface TrainingStatisticsInterface {
  week: { km: number; elevationGain: number };
  month: { km: number; elevationGain: number };
  year: { km: number; elevationGain: number };
}
```

### Models

Para cada una de las rutas de la api, se ha creado un modelo de datos, se debe crear una interfaz para dicho modelo y un esquema de mongoose. 

#### Track

La interfaz diseñada para una ruta es el siguiente:

```typescript
interface TrackDocumentInterface extends Document {
  name: string;
  startCoordinates: [number, number]; // [lat, long]
  endCoordinates: [number, number]; // [lat, long]
  length: number;
  grade: number;
  users: [UserDocumentInterface];
  activity: Activity;
  rating: number;
}
```

En este caso, el id de los usuarios que han realizado la ruta se almacena como un array de usuarios, usando la interfaz de usuario que se ha creado y se comentará más adelante. Además, el tipo de actividad es el enumerado que se ha comentado anteriormente, otra cosa a resaltar es que las cordeenadas se almacenan como un array de dos elementos, el primero es la latitud y el segundo la longitud.

El esquema de mongoose para este modelo es el siguiente:

```typescript
const trackSchema = new Schema<TrackDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  startCoordinates: {
    type: [Number, Number],
    required: true,
  },
  endCoordinates: {
    type: [Number, Number],
    required: true,
  },
  length: {
    type: Number,
    required: true,
    validate: {
      validator: function(val: number) {
        return val > 0;
      },
      message: props => `Invalid length: ${props.value}`
    }
  },
  grade: {
    type: Number,
    required: true,
    validate: {
      validator: function(val: number) {
        return val >= 0;
      },
      message: props => `Invalid grade: ${props.value}`
    }
  },
  users: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  activity: {
    type : String, 
    enum : Object.values(Activity),
    required: true,
  },
  rating: {
    type: Number,
    required: false,
    validate: {
      validator: function(val: number) {
        return val >= 0 && val <= 5;
      },
      message: props => `Invalid rating: ${props.value}`
    }
  },
});
```

Viendo punto por punto, comenzando por el atributo `name`, vemos que es de tipo `String`, que es requerido, que se le aplica un `trim` para eliminar los espacios en blanco al principio y al final y que es único, osea que no puede existir un track en la base de datos con el mismo nombre que otro. Los atributos `startCoordinates` y `endCoordinates` son de tipo `Number` y son requeridos. El atributo `length` es de tipo `Number`, es requerido y se le aplica una validación para que el valor sea mayor que 0. El atributo `grade` es de tipo `Number`, es requerido y se le aplica una validación para que el valor sea mayor o igual que 0. El atributo `users` es de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de usuarios, es requerido y por defecto es un array vacío. El atributo `activity` es de tipo `String`, es requerido y se le aplica una validación para que el valor sea uno de los valores del enumerado `Activity`. El atributo `rating` es de tipo `Number`, es requerido y se le aplica una validación para que el valor sea mayor o igual que 0 y menor o igual que 5.

Por ultimo en este fichero se exporta el modelo de datos de la siguiente manera:

```typescript
export const Track = model<TrackDocumentInterface>('Track', trackSchema);
```

#### User

La interfaz diseñada para un usuario es el siguiente:

```typescript
interface UserDocumentInterface extends Document {
  name: string;
  activity: Activity;
  friends: UserDocumentInterface[];
  groups: GroupDocumentInterface[]
  trainingStatistics: TrainingStatisticsInterface;
  favouriteTracks: TrackDocumentInterface[];
  activeChallenges: ChallengeDocumentInterface[];   
  tracksHistory: HistoryData[];
}
```

En este caso, el id de los amigos se almacena como un array de usuarios, usando la propia interfaz de usuario. Además, el tipo de actividad es el enumerado que se ha comentado anteriormente, otra cosa a resaltar es que las estadísticas de entrenamiento se almacenan como un objeto de la interfaz de estadísticas de entrenamiento comentada anteriormente. Las rutas favoritas se almacenan como un array de rutas, usando la interfaz de ruta que se ha creado y se comentará más adelante, de igual forma con los retos activos. Por último, el histórico de rutas se almacena como un array de objetos de la interfaz de histórico de rutas comentada anteriormente, que consta de un id de ruta y una fecha en la que se realizó la ruta.







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