const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Auction = require('../lib/models/Auction');
const User = require('../lib/models/User');
const auctions = require('../lib/routes/auctions');

describe('auction-coffee routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'test@langston.com',
      password: 'passMe'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('CREATES a new Auction vea POST', () => {
    return request(app)
      .post('/api/v1/auctions')
      .auth('test@langston.com', 'passMe')
      .send({
        title: 'coffee auctions',
        description: 'selling Guatamala coffee',
        end: new Date(2008, 3, 15),
        user: user._id,
        quantity: 4,
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'coffee auctions',
          description: 'selling Guatamala coffee',
          'end': '2008-04-15T07:00:00.000Z',
          'quantity': 4,
          user: user.id
        });
      });
  });

  it('GET a new Auction vea GET', async() => {
    const auction = await Auction.create({
      title: 'coffee auctions',
      description: 'selling Guatamala coffee',
      end: new Date(2008, 3, 15),
      user: user._id,
      quantity: 4,
    }).auth('test@langston.com', 'passMe');
      
    return request(app)
      .get(`api/v1/auctions/${auction.id}`)
      .auth('test@langston.com', 'passMe')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'coffee auctions',
          description: 'selling Guatamala coffee',
          'end': '2008-04-15T07:00:00.000Z',
          'quantity': 4,
          user: user.id
        }]);
      });
  });


  it('GET a new Auction vea GET', () => {
    return Auction.create({
      title: 'coffee auctions',
      description: 'selling Guatamala coffee',
      end: new Date(2008, 3, 15),
      user: user._id,
      quantity: 4,
    })
      .then(auction => request(app.get('api/v1/auction')
        .auth('test@langston.com', 'passMe')))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'coffee auctions',
          description: 'selling Guatamala coffee',
          'end': '2008-04-15T07:00:00.000Z',
          'quantity': 4,
          user: user.id
        }]);
      });
  });
});

