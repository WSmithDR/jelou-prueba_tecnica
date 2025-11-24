const {pool} = require('../../config');

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE customers SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL', 
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Cliente no encontrado o ya eliminado' });
    }

    res.json({ success: true, message: 'Cliente eliminado correctamente (Soft Delete)' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = deleteCustomer;