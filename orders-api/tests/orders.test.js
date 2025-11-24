const request = require('supertest');
const app = require('../index');
const { pool } = require('../src/config');

describe('Orders API Integration Tests', () => {
  
  afterAll(async () => {
    await pool.end();
  });

  it('GET /health debería retornar status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('UP');
  });

  it('POST /orders debería fallar si el payload es inválido (Stock negativo)', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        customer_id: 1,
        items: [{ product_id: 1, qty: -5 }] // Cantidad inválida
      });
    
    // Esperamos error de validación Zod (400)
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});