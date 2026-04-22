const db = require("../models");
const User = db.User;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ message: "Неверное имя пользователя" });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: "Неверный пароль" });
    }
    
    // Если пользователь - курьер, получаем его данные
    let courier = null;
    if (user.role === 'courier' && user.courierId) {
      courier = await db.Courier.findByPk(user.courierId);
    }
    
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      courierId: user.courierId,
      courier: courier ? {
        id: courier.id,
        firstName: courier.first_name,
        lastName: courier.last_name,
        phone: courier.phone,
        status: courier.status
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};