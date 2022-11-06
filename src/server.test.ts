const axios = require("axios");

const globalURL = 'http://localhost:3333';

let apiKey = '';
let pollCode = '';

beforeAll(() => {
  // jest.spyOn(console, 'log').mockImplementation(() => { });
});

describe('auth', () => {
  test('Should make login and returns a token', async () => {
    const result = await axios.post(`${globalURL}/users`, {
      access_token: 'ya29.a0AeTM1ie4hgnYw6chSzYq8AGI1zkraLtn4xXg72j54Y26oqQ5zourMobHhZNL4t7NQ5k3Ty0UGBqOItSCfeyvNNbsSbN8CQGbbSeOv0x6Lvzm4vX_54xOFDhTZrqE4mTM3vuXvuGXj9K-uBfyHYGPgUsrMtvOegaCgYKAX0SARESFQHWtWOmepNjtTsb3R1KyoXQbe3pWg0165',
    });

    const data = result.data;

    expect(result.status).toBe(200);
    expect(typeof data.token).toBe('string');
    expect(data.token.length).toBeGreaterThan(0);

    apiKey = data.token;
  });

  test('Should validate a token', async () => {
    const result = await axios.get(`${globalURL}/me`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
    });

    const data = result.data;

    expect(result.status).toBe(200);
    expect(typeof data.user.name).toBe('string');
    expect(data.user.name.length).toBeGreaterThan(0);
    expect(typeof data.user.avatar_url).toBe('string');
    expect(data.user.avatar_url.length).toBeGreaterThan(0);
  });
});

describe('polls', () => {
  const baseURL = globalURL + '/polls';
  let count = 0;
  test('Should count polls', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThan(0);
    count = data.count;
  });

  test('Should create a poll', async () => {
    const result = await axios.post(baseURL, {
      title: 'Bola1'
    });
    const data = result.data;

    expect(result.status).toBe(201);
    expect(typeof data.code).toBe('string');
    expect(data.code.length).toBeGreaterThan(0);

    pollCode = data.code;
  });

  test('Should count polls after added', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThan(0);
    expect(data.count).toBe(count + 1);
  });

  test('Authenticated user joining in a poll', async () => {
    const result = await axios.post(`${baseURL}/join`, {
      code: pollCode,
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
    });

    expect(result.status).toBe(201);
  });
});

describe('users', () => {
  const baseURL = globalURL + '/users';
  test('Should count users', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThanOrEqual(0);
  });
});

describe('guesses', () => {
  const baseURL = globalURL + '/guesses';
  test('Should count guesses', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThanOrEqual(0);
  });
});
