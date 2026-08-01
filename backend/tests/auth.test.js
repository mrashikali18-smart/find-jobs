const request = require('supertest');
const app = require('../app');

describe('Auth', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('registers a new jobseeker', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Jobseeker',
      email: 'jobseeker@test.com',
      password: 'password123',
      role: 'jobseeker',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('jobseeker');
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects duplicate email registration', async () => {
    const payload = {
      name: 'Dup User',
      email: 'dup@test.com',
      password: 'password123',
      role: 'jobseeker',
    };
    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(409);
  });

  it('logs in with correct credentials and rejects wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@test.com',
      password: 'password123',
      role: 'jobseeker',
    });

    const good = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });
    expect(good.status).toBe(200);

    const bad = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'wrongpass' });
    expect(bad.status).toBe(401);
  });
});
