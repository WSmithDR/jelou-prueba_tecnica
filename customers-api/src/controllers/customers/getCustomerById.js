const {pool} = require('../../config');

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM customers WHERE id = ? AND deleted_at IS NULL', 
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = getCustomerById;