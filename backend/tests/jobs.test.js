const request = require('supertest');
const app = require('../app');

describe('Jobs', () => {
  it('lists jobs publicly with no auth', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.jobs)).toBe(true);
  });

  it('rejects job creation without auth', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Backend Engineer',
      description: 'Build things',
      category: 'Engineering',
      location: 'Remote',
    });
    expect(res.status).toBe(401);
  });

  it('rejects job creation from a jobseeker account', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send({
      name: 'Some Jobseeker',
      email: 'seeker@test.com',
      password: 'password123',
      role: 'jobseeker',
    });

    const res = await agent.post('/api/jobs').send({
      title: 'Backend Engineer',
      description: 'Build things',
      category: 'Engineering',
      location: 'Remote',
    });
    expect(res.status).toBe(403);
  });

  it('allows a recruiter to create and then publicly fetch a job', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send({
      name: 'Some Recruiter',
      email: 'recruiter@test.com',
      password: 'password123',
      role: 'recruiter',
      companyName: 'Acme Inc',
    });

    const create = await agent.post('/api/jobs').send({
      title: 'Backend Engineer',
      description: 'Build things',
      category: 'Engineering',
      location: 'Remote',
    });
    expect(create.status).toBe(201);

    const list = await request(app).get('/api/jobs');
    expect(list.body.jobs.some((j) => j.title === 'Backend Engineer')).toBe(true);
  });
});
