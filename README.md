[![Tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupok/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupok/actions/workflows/tests.yml)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupok/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupok?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupok&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupok)

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

El esquema de mongoose para este modelo es el siguiente:

```typescript
const userSchema = new Schema<UserDocumentInterface>({
  name: {
    type: String,
    required: false,
    trim: true,
    unique: true,
  },
  activity: {
    type: String,
    enum: Object.values(Activity),
    required: true,
  },    
  friends: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
    validate: {
      validator: async function() {
        // Verificar que no haya usuarios repetidos en el array
        const existingFriends = await this.$model('User').countDocuments({
          _id: { $in: this.friends },
        });
      
        if (existingFriends !== this.friends.length) {
          return false;
        }
        return true;
      },
      message: props => `Invalid friends, some duplicated id: ${JSON.stringify(props.value)}`
    }  
  },
  groups: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Group',
  },
  trainingStatistics: {
    type: Object,
    validate: {
      validator: function(val: TrainingStatisticsInterface) {
        const isWeekValid = val.week && typeof val.week.km === "number" && typeof val.week.elevationGain === "number";
        const isMonthValid = val.month && typeof val.month.km === "number" && typeof val.month.elevationGain === "number";
        const isYearValid = val.year && typeof val.year.km === "number" && typeof val.year.elevationGain === "number";
        return isWeekValid && isMonthValid && isYearValid;
      },
      message: props => `Invalid training statistics: ${JSON.stringify(props.value)}`
    },
    required: true,
  },  
  favouriteTracks: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Track',
    validate: {
      validator: async function(tracksIds: TrackDocumentInterface[]) {
        const Track = model('Track');
        for (const trackId of tracksIds) {
          const track = await Track.findById(trackId);
          if (!track) {
            return false; // El ID de track no existe en la base de datos
          }
        }

        return true; // Todos los IDs de track existen en la base de datos
      },
      message: 'One or more track IDs do not exist.',
    },  
  },
  activeChallenges: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Challenge',
  },
  tracksHistory: {
    type: [Object],
    default: [],
    ref: 'Track',
  },
});
```

Viendo punto por punto, comenzando por el atributo `name`, vemos que es de tipo `String`, que no es requerido, que se le aplica un `trim` para eliminar los espacios en blanco al principio y al final y que es único, osea que no puede existir un usuario en la base de datos con el mismo nombre que otro. 

El atributo `activity` es de tipo `String`, es requerido y se le aplica una validación para que el valor sea uno de los valores del enumerado `Activity`. 

El atributo `friends` es un array de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de usuarios, es requerido, por defecto es un array vacío y se le aplica una validación para que no haya ids repetidos en el array y a la vez que todos los ids de usuarios existan en la base de datos.

El atributo `groups` es un array de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de grupos, es requerido, por defecto es un array vacío. 

El atributo `trainingStatistics` es de tipo `Object`, es requerido y se le aplica una validación para comprobar que tenga los atributos de la interfaz de estadísticas de entrenamiento comentada anteriormente. 

El atributo `favouriteTracks` es un array de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de rutas, es requerido, por defecto es un array vacío y se le aplica una validación para que todos los ids de rutas existan en la base de datos. 

El atributo `activeChallenges` es un array de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de retos, es requerido, por defecto es un array vacío. 

El atributo `tracksHistory` es un array de tipo `Object`, es decir, es un array de objetos de la interfaz de histórico de rutas comentada anteriormente, es requerido y por defecto es un array vacío.

Por ultimo en este fichero se exporta el modelo de datos al igual que en el anterior, pero siendo este caso `User`.

#### Group

La interfaz de grupo que se ha diseñado es la siguiente:

```typescript
interface GroupDocumentInterface extends Document {
  name: string;
  members: UserDocumentInterface[];
  groupStatistics: TrainingStatisticsInterface;
  userClasification: number[]; // usuarios ordenados por cantidad de km más el desnivel
  favouriteTracks: TrackDocumentInterface[]; // ordenado de mayor a menor en función del número de veces que se ha hecho la ruta
  tracksHistory: HistoryData[];
}
```

En esta, simplemente se almacena el nombre del grupo, los miembros del grupo los cuales son un array de usuarios, usando la interfaz de usuario. Las estadísticas de entrenamiento del grupo, que son un objeto de la interfaz de estadísticas de entrenamiento comentada anteriormente. La clasificación de los usuarios, que es un array de ids de usuarios ordenados por la cantidad de km más el desnivel. Las rutas favoritas del grupo, que son un array de rutas, usando la interfaz de ruta que se ha creado. Por último, el histórico de rutas se almacena como un array de objetos de la interfaz de histórico de rutas comentada anteriormente, que consta de un id de ruta y una fecha en la que se realizó la ruta.

En cuanto al esquema utilizado para este modelo, es el siguiente:

```typescript
const groupSchema = new Schema<GroupDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  members: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  groupStatistics: {
    type: Object,
    validate: {
      validator: function(val: TrainingStatisticsInterface) {
        const isWeekValid = val.week && typeof val.week.km === "number" && typeof val.week.elevationGain === "number";
        const isMonthValid = val.month && typeof val.month.km === "number" && typeof val.month.elevationGain === "number";
        const isYearValid = val.year && typeof val.year.km === "number" && typeof val.year.elevationGain === "number";
        return isWeekValid && isMonthValid && isYearValid;
      }
    },
    required: false,
  },
  userClasification: {
    type: [Number],
    default: [],
  },
  favouriteTracks: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Track',
  },
  tracksHistory: {
    type: [Object],
    default: [],
  },
});
```

En este podemos ver, que el atributo `name` es de tipo `String`, es requerido, se le aplica un `trim` para eliminar los espacios en blanco al principio y al final y es único, osea que no puede existir un grupo en la base de datos con el mismo nombre que otro. 

En cuanto al atributo `members`, es un array de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de usuarios, es requerido, por defecto es un array vacío.

El atributo `groupStatistics` es de tipo `Object`, es decir, es un objeto de la interfaz de estadísticas de entrenamiento comentada anteriormente, no es requerido y se le aplica una validación para asi comprobar que tenga los atributos de la interfaz de estadísticas de entrenamiento comentada anteriormente.

El atributo `userClasification` es un array de tipo `Number`, es decir, es un array de números, es requerido y por defecto es un array vacío.

El atributo `favouriteTracks` es un array de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de rutas, es requerido, por defecto es un array vacío.

El atributo `tracksHistory` al igual que en modelos comentados anteriormente es un array de tipo `Object`, es decir, es un array de objetos de la interfaz de histórico de rutas comentada anteriormente, es requerido y por defecto es un array vacío.

Por ultimo en este fichero se exporta el modelo de datos al igual que en los anteriores, pero siendo este caso `Group`.

#### Challenge

Para los retos se ha diseñado la siguiente interfaz:

```typescript
export interface ChallengeDocumentInterface extends Document {
  name: string;
  tracks: TrackDocumentInterface[];
  activity: Activity;
  length: number;
  users: UserDocumentInterface[];
}
```

Cada reto tiene un nombre, un array de rutas, usando la interfaz de ruta que se ha creado. El tipo de actividad, que es el enumerado que se ha comentado anteriormente. La longitud del reto, que es la suma de los kilómetros de las rutas que lo engloban. Por último, los usuarios que están realizando el reto, que es un array de usuarios, usando la interfaz de usuario.

En cuanto al esquema utilizado para este modelo, es el siguiente:

```typescript
const challengeSchema = new Schema<ChallengeDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
  users: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'User',
  },
  tracks: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'Track',
  },
  activity: {
    type : String, 
    enum : Object.values(Activity),
    required: true,
  },

});
```

Hay elementos comunes a los demas esquemas, como el nombre, el tipo de actividad y los usuarios que están realizando el reto, por lo que no se comentarán de nuevo. Lo único diferente en este caso es el atributo `tracks`, que es un array de tipo `Schema.Types.ObjectId`, es decir, es un array de ids de rutas, es requerido, por defecto es un array vacío y se le aplica una validación para que todos los ids de rutas existan en la base de datos.

Por ultimo en este fichero se exporta el modelo de datos al igual que en los anteriores, pero siendo este caso `Challenge`.

### Routes

Para cada una de las rutas correspondientes a cada modelo de datos, se ha creado un fichero, en el que se encuentra implementadas las operaciones que se puede realizar sobre cada ruta, que son básicamente las operaciones CRUD. Cabe resaltar que todos el código de estos ficheros sigue el patrón async/await. 

#### User

Todas las operaciones a llevar a cabo sobre los usuarios, se realizan a traves de la ruta `/users`, utilizando los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). Este es el mas amplio a comentar, por lo que se comentará cada una de las operaciones por separado.

##### POST

Esta operación se utiliza para crear un nuevo usuario, para ello se debe realizar una petición POST a la ruta `/users` con la información del usuario en el body de la petición, casi al final de este informe hay un ejemplo de como debe ser el body de la petición para cada caso.

Como se puede ver sigue el schema que comentamos con anterioridad, el atributo `name` es el nombre del usuario, el atributo `activity` es el tipo de actividad que realiza, el atributo `friends` es un array de ids de usuarios, el atributo `groups` es un array de ids de grupos, el atributo `trainingStatistics` es un objeto con las estadísticas de entrenamiento, el atributo `favouriteTracks` es un array de ids de rutas, el atributo `tracksHistory` es un array de objetos con el id de la ruta y la fecha en la que se realizó y por último el atributo `activeChallenges` es un array de ids de retos, cabe destacar que las id de los amigos, grupos, rutas y retos deben existir en la base de datos, además se puden omitir muchos de los atributos, ya que no son requeridos y tienen un valor por defecto.

En cuanto a la implementación de esta operación, se puede ver en el siguiente código:

```typescript
userRouter.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    // actualizar los grupos de los que forme parte el usuario
    for (const groupID of user.groups) {
      await Group.findByIdAndUpdate(groupID, { $push: { members: user._id }}, { new: true, runValidators: true, });
    }
    // actualizar los usuarios de los challenge que tiene activos
    for (const challengeID of user.activeChallenges) {
      await Challenge.findByIdAndUpdate(challengeID, { $push: { users: user._id }}, { new: true, runValidators: true, });
    }
    // actualizar las rutas realizadas, añadiendo el usuario a la ruta
    for (const trackID of user.tracksHistory) {
      await Track.findByIdAndUpdate(trackID.track, { $push: { users: user._id }}, { new: true, runValidators: true, });
    }
    await user.save()
    return res.status(201).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});
```

Lo primero que es guardar en una variable el usuario que se ha pasado en el body de la petición, después se actualizan los grupos de los que forma parte el usuario recorriendo el array de ids de grupos que se ha pasado en el body de la petición, para cada uno de estos grupos se actualiza el grupo en la base de datos añadiendo el id del usuario al array de miembros del grupo. Después se actualizan los usuarios de los retos que tiene activos de la misma forma, también se actualizan las rutas realizadas, añadiendo el usuario a la ruta. Por último, se guarda el usuario en la base de datos y se devuelve el usuario creado con codigo de status 201. En caso de que haya algún error, se devuelve un error 400. 

##### GET

Mediante el método GET se puede obtener información de los usuarios, para ello hay distintas formas de realizar la petición como se mencionó previamente, se puede consultar un usuario concreto por su nombre usando una query en la url, se puede cosultar un usuario en concreto por su id usando este como parámetro en la url o se puede consultar todos los usuarios simplemente con la ruta base `/users` utilizando este metodo.

El código de la implementación de esta operación es el siguiente:

```typescript
/**
 * Get para todos los usuarios o para un usuario en específico mediante nombre usando query
 */
userRouter.get("/users", async (req, res) => {
  const name = req.query.name;
  try {
    let users;
    if (name) {
      // Find all users that match the name
      users = await User.find({ name }).populate(
        { path: "friends", select: "name"}
      ).populate(
        { path: "groups", select: "name"}
      ).populate(
        { path: "activeChallenges", select: "name"}
      ).populate(
        { path: "favouriteTracks", select: "name"}
      ).populate(
        { path: "tracksHistory.track", select: "name"}
      );
    } else {
      // Find all users
      users = await User.find().populate({ path: "friends", select: "name"}
      ).populate(
        { path: "groups", select: "name"}
      ).populate(
        { path: "activeChallenges", select: "name"}
      ).populate(
        { path: "favouriteTracks", select: "name"}
      ).populate(
        { path: "tracksHistory.track", select: "name"}
      );
    }
    if (users.length === 0) {
      return res.status(404).send();
    }
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * Get para un usuario en específico mediante ID
 */
userRouter.get("/users/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findById(userID).populate(
      { path: "friends", select: "name"}
    ).populate(
      { path: "groups", select: "name"}
    ).populate(
      { path: "activeChallenges", select: "name"}
    ).populate(
      { path: "favouriteTracks", select: "name"}
    ).populate(
      { path: "tracksHistory.track", select: "name"}
    );
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (err) {
    return res.status(500).send();
  }
});
```

En el primer caso, se obtiene el nombre del usuario de la query de la url, si existe se buscan todos los usuarios que coincidan con ese nombre, si no existe se buscan todos los usuarios. En ambos casos se utiliza el método `populate` para obtener información (en este caso solo el nombre) de los usuarios que son amigos, grupos, retos, rutas favoritas y rutas realizadas. En el segundo caso, se obtiene el id del usuario de los parámetros de la url, se busca el usuario con ese id. En ambos casos, si no se encuentra ningún usuario se devuelve un error 404 y si hay algún error se devuelve un error 500.

##### PATCH

Mediante el método PATCH se puede actualizar información de los usuarios, para ello hay distintas formas de realizar la petición al igual que en el método GET, además el cuerpo de la petición debe contener la información que se quiere actualizar.

El código de la implementación de esta operación es el siguiente:

```typescript
userRouter.patch("/users", async (req, res) => {
  //actualizar un usaurio por su nombre
  const name = req.query.name;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "activity",
    "friends",
    "groups",
    "favouriteTracks",
    "activeChallenges",
    "tracksHistory",
    "trainingStatistics",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {            
    const user = await User.findOneAndUpdate({ name }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    // recorrer updates y actualizar las demas cosas en cada caso
    for (const update of updates) {
      switch (update) {
        case "groups":
          // borrar de los grupos en los que es participante
          await Group.updateMany({ members: user._id },{ $pull: { members: user._id }});
          for(const groupID of req.body.groups) {
            await Group.findByIdAndUpdate(groupID, { $push: { members: user._id }}, { new: true, runValidators: true, });
          }
        break;
        case "activeChallenges":
          // borrar de los challenge en los que es participante
          await Challenge.updateMany({ users: user._id },{ $pull: { users: user._id }});
          for(const challengeID of req.body.activeChallenges) {
            await Challenge.findByIdAndUpdate(challengeID, { $push: { users: user._id }}, { new: true, runValidators: true, });
          }
        break;
        case "tracksHistory":
          // borrar de los tracks en los que es participante
          await Track.updateMany({ users: user._id },{ $pull: { users: user._id }});
          for(const track of req.body.tracksHistory) {
            const trackID = track.track;
            await Track.findByIdAndUpdate(trackID, { $push: { users: user._id }}, { new: true, runValidators: true, });
          }
        break;
        default:
        break;
      }
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send(err);
  }
});
```

Este es el código para realizar el patch utilizando la query de la url para obtener el nombre del usuario, para el caso de usar el id es exactamente lo mismo que este pero utilizando algunas funciones buscando con el id en lugar del nombre como en el GET.

Primero se obtienen las claves del body de la petición, se comprueba que todas las claves sean actualizaciones válidas, se busca el usuario por el nombre y se actualiza con la información del body de la petición, devolviendo el nuevo usuario (para ello se usa la variable new en la llamada a `findOneAndUpdate`). Después se recorren las claves del body de la petición y se actualizan las demás cosas en cada caso, en el caso de los grupos, se eliminan los grupos de los que es participante y se actualizan con los nuevos grupos, en el caso de los retos, se eliminan los retos de los que es participante y se actualizan con los nuevos retos, en el caso de las rutas realizadas, se eliminan las rutas de las que es participante y se actualizan con las nuevas rutas. En caso de que no se encuentre el usuario se devuelve un error 404 y en caso de que haya algún error se devuelve un error 400, si no hay ningún error se devuelve el usuario actualizado con un código 200.

##### DELETE

Mediante el método DELETE se puede eliminar un usuario, para ello tambien hay distintas formas de realizar la petición al igual que en los métodos anteriores. 

El código de la implementación de esta operación es el siguiente:

```typescript
/**
 * Delete para eliminar un usuario en específico mediante ID
 */
userRouter.delete("/users/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findById(userID);
    //const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    await User.findByIdAndDelete(userID);
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});
```

Este es el código para borrar buscando por el id, para el caso de usar el nombre es exactamente lo mismo que este pero utilizando algunas funciones buscando con el nombre en lugar del id. 

Primero se obtiene el id del usuario de los parámetros de la url, se busca el usuario con ese id, si no se encuentra se devuelve un error 404, si se encuentra se elimina y se devuelve el usuario eliminado con un código 200. En caso de que haya algún error se devuelve un error 500. Cabe destacar que al borrar el usuario, se eliminan las referencias a este en los grupos, retos y rutas realizadas, sin mebargo hay ciertos objetos que no se eliminan, por ejemplo cuando un id de usuario está dentro de un objeto historyData, este no se elimina.

#### Group

Para las operaciones sobre los grupos, se utiliza la ruta `/groups`, utilizando los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). En cuanto a este, es muy similar al de los usuarios, por lo que no se comentará en detalle cada operación, para empezar el DELETE es exactamente igual, esto se repite en los demas modelos.

En cuanto al post lo único que cambia es lo que se actualiza, en este caso se actualizan los grupos de los usuarios que forman parte del grupo.

Por otro lado, el get es exactamente igual, lo que cambia es la información que se muestra con el populate, en este caso solo se muestra el nombre de los usuarios que forman parte del grupo y el nombre de las rutas favoritas del grupo.

Por último, el patch en gran parte también es igual, solo que las opciones validas a actualizar son diferentes y lo único que hay que tener en cuenta es que si se actualizan los miembros del grupo, se actualizan los grupos de los usuarios que forman parte del grupo.

#### Challenge

Para las operaciones sobre los retos, se utiliza la ruta `/challenges`, utilizando los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). Este también es muy similar a los anteriores, por lo que no se comentará en detalle cada operación

En cuanto al post lo único que cambia es lo que se actualiza, en este caso se actualizan los retos activos de los usuarios que están realizando el reto.

Por otro lado, en el get lo que cambia es la información que se muestra con el populate, que en este caso solo se muestra el nombre de los usuarios que están realizando el reto y el nombre de las rutas que forman parte del reto.

Por último, en el patch solo cambia las opciones validas a actualizar, Cabe destacar que si se actualizan las rutas que forman parte del reto, se actualizan los retos activos de los usuarios que están realizando el reto.

#### Track

En este caso se utiliza la ruta `/tracks`, utilizando también los métodos HTTP referentes a cada operación CRUD (POST, GET, PATCH, DELETE). Este también es muy similar a los anteriores, por lo que no se comentará en detalle cada operación sino los cambios en cada una de ellas.

En cuanto al post lo único que cambia es que en este caso se actualizan las rutas favoritas de los usuarios que tienen la ruta como favorita.

Por otro lado, en el get lo que cambia es la información que se muestra con el populate, que en este caso solo se muestra el nombre de los usuarios que tienen la ruta como favorita.

Por último, en el patch cambia las opciones validas a actualizar. Lo unico a mencionar es que si se actualizan los usuarios que tienen la ruta como favorita, se actualizan las rutas favoritas de los usuarios que tienen la ruta como favorita.

Se debe mencionar que en el `delete` se deberían borrar las referencias a la ruta en los usuarios que la tienen dentro de su `tracksHistory`, sin embargo, esto no se ha podido realizar, ya que la base de datos no permite esto o no encontramos la forma, ya que al formar parte de un objeto con el elemento id y la fecha, conseguimos borrar la referencia al id, pero no a la fecha. y se quedaba igual el objeto pero con el id vacio y la fecha aun existiendo.

## Ejecución y ejemplos de uso
Para la ejecucicón de la API, hay uqe seguir un procedimiento, el cual es la ejecución del servidor en MongoDB, y luego la ejecución del servidor en express o la pruebas, según lo que se desee. Los comandos son:

- Servidor mongodb:  `sudo /home/usuario/mongodb/bin/mongod --dbpath /home/usuario/mongodb-data/`
- Servidor express: `npm run dev (de momento)`
- Test: `npm run test`

Podremos acceder al servidor mediante la dirección http `http://localhost:3000` mediante operaciones CRUD, donde se utilizan cuerpos en formato JSON. Se ofrecen distintos ejemplos usados a lo largo del desarrollo, los cuales se pueden emplear como plantillas para hacer solicitudes (Recordar eliminar los ID porque aparecerán errores si no encuentan dichos id en la base de datos):

#### User:
```typescript
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
```

#### Groups:
```typescript
{
 "name": "GrupoBrayan",
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
  "members": [],
  "favouriteTracks": []
  "tracksHistory": []
}
```

#### Challenge:
```typescript
{
  "name": "SergioChallenge",
  "tracks": [],
  "activity": "running",
  "length": 45,
  "users": []
}
```

#### Track:
```typescript
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
```

## MongoDBAtlas y Cyclic
Mediante MongoDBAtlas y Cyclic, se ha subido la base de datos y la api a servidores que permiten su uso fuera de este entorno. Los enlaces de interes son:

- Base de datos en MongoDBAtlas: `mongodb+srv://tracks-rest-api:tracksDSI@cluster0.owwhfgp.mongodb.net/`
- Acceso al servidor de cyclic: `https://wide-eyed-plum-dungarees.cyclic.app`

## Conclusiones
En este proyecto se ha podido ver como se puede crear un sistema de gestión de rutas de una manera más eficiente que en el primer proyecto. Se simplifica todo a la realización de distintas peticiones, las facilidades que ofrecen por ejemplo Mongoose o el validador se pueden comprobar en busca de errores y que gracias a la base de datos ofrecida por MongoDB podemos almacenar. Además, También cabe mencionar el uso de MongoDB Atlas y Cyclic, que permiten tener tanto la base de datos como el servidor en la nuve para poder acceder desde fuera del entorno  de desarrollo. Todo junto ha permitido un desarrollo solido y consistente de la API rest que se observa como resultado.

Al haber hecho esta práctica en grupo, también hemos observado una mejora respecto a la primera en cuanto a la velocidad de desarrollo al estar familiarizados con el entorno, lo que nos ha permitido un desarrollo más eficiente.

## Referencias

- [Guión de la práctica](https://ull-esit-inf-dsi-2223.github.io/prct12-destravate-api/)
- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)
- [ágina de mongoDBAtlas:](https://www.mongodb.com/atlas/database)
- [Página de Cyclic](https://www.cyclic.sh/)
