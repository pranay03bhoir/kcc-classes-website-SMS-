const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      res.status(400).json({
        success: false,
        message: `User ${existingAdmin.name} already exists, Kindly login`,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const admin = Admin({
        name,
        email,
        password: hashedPassword,
      });
      await admin.save();
      res.status(200).json({
        success: true,
        message: "Registered successfully",
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
