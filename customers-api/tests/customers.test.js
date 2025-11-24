const request = require('supertest');
const app = require('../index');
const { pool } = require('../src/config');

describe('Customers API Integration Tests', () => {
  
  afterAll(async () => {
    await pool.end();
  });

  it('POST /customers debería validar campos requeridos', async () => {
    const res = await request(app)
      .post('/customers')
      .send({
        // Enviamos body vacío para provocar error
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});