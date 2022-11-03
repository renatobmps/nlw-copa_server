const axios = require("axios");

const globalURL = 'http://localhost:3333';

beforeAll(() => {
  // jest.spyOn(console, 'log').mockImplementation(() => { });
})

describe('pools', () => {
  const baseURL = globalURL + '/pools';
  let count = 0;
  test('Should count pools', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThan(0);
    count = data.count;
  });

  test('Should create a pool', async () => {
    const result = await axios.post(baseURL, {
      title: 'Bola1'
    });
    const data = result.data;

    console.log(data);

    expect(result.status).toBe(201);
    expect(typeof data.code).toBe('string');
    expect(data.code.length).toBeGreaterThan(0);
  });

  test('Should count pools after added', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThan(0);
    expect(data.count).toBe(count + 1);
  });
});

describe('users', () => {
  const baseURL = globalURL + '/users';
  test('Should count users', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThan(0);
  });
});

describe('guesses', () => {
  const baseURL = globalURL + '/guesses';
  test('Should count guesses', async () => {
    const result = await axios.get(`${baseURL}/count`);
    const data = result.data;

    expect(data.count).toBeGreaterThan(0);
  });
});