import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/app.js';
import { User } from '../../src/models/user.js';

/// Creamos 2 usuarios para hacer las pruebas
const firstUser = {
  name: "Yanfri",
  activities : "running", 
  trainingStatistics : {
    week : { km : 10,
      elevationGain : 100,
    },
    month : { km : 0,
      elevationGain : 0,
    },
    year : { km : 0,
      elevationGain : 0,
    },
  },
}

// const secondUser = {
//   name: "Aday",
//   activities : "running",
//   trainingStatistics : {
//     week : { km : 10,
//       elevationGain : 100,
//     },
//     month : { km : 0,
//       elevationGain : 0,
//     },
//     year : { km : 0,
//       elevationGain : 0,
//     },
//   },
// }

/// Creamos a los usuarios
describe('POST /users', () => {
  it('Should successfully create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: "Yanfri",
      activities : "running", 
      trainingStatistics : {
        week : { km : 10,
          elevationGain : 100,
        },
        month : { km : 0,
          elevationGain : 0,
        },
        year : { km : 0,
          elevationGain : 0,
        },
      },
    }).expect(201);


    console.log("//////////////////////////////////////////////////////");
    console.log(response.body);
    console.log("//////////////////////////////////////////////////////");
    
    expect(response.body).to.include({
      name: "Yanfri",
      activities : "running", 
    });

    expect (response.body._id).to.include({
      trainingStatistics : {
        week : { km : 10, elevationGain : 100},
        month : { km : 0, elevationGain : 0 },
        year : { km : 0, elevationGain : 0 },
      },
    });
    /// TODO: trainingStatistics falla: como que no reconoce bien el formato o algo, porque incluirlo lo incluye

    
    const secondUser = await User.findById(response.body._id);
    expect(secondUser).not.to.be.null;
    expect(secondUser?.name).to.equal('Yanfri');
  });

  it('Should get an error', async () => {
    await request(app).post('/users').send(firstUser).expect(400);
  });
});

// describe('GET /users', () => {
//   it('Should get a user by username', async () => {
//     await request(app).get('/users?username=esegredo').expect(200);
//   });

//   it('Should not find a user by username', async () => {
//     await request(app).get('/users?username=edusegre').expect(404);
//   });
// });

/// Borramos todos los usuarios
after(async () => {
  await User.deleteMany();
});