const createOrderSchema = require('./order.schema');
const {createProductSchema, updateProductSchema} = require('./product.schema');

module.exports = {
    createOrderSchema,
    createProductSchema,
    updateProductSchema
}