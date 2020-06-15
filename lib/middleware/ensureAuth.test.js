const { userPasswordReader } = require('./ensureAuth');

describe('ensureAuth middleware', () => {


  it('can read a username/password from the header', () => {
    const authorization = 'Basic cnlhbjpwYXNzd29yZA==';
    expect(userPasswordReader(authorization)).toEqual({
      username: 'ryan',
      password: 'password'
    });
  });
});
