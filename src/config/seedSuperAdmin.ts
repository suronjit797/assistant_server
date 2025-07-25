import dotenv from "dotenv";
import config from ".";
import UserModel from "../app/user/user.model";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    const superAdminEmail = config.SUPER_ADMIN_EMAIL;
    const superAdminName = config.SUPER_ADMIN_NAME;
    const superAdminPassword = config.SUPER_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      throw new Error("Super admin credentials are not defined in environment variables");
    }

    // Check if super admin already exists
    const existingSuperAdmin = await UserModel.findOne({
      email: superAdminEmail,
      role: "superAdmin",
    });

    if (!existingSuperAdmin) {
      // Hash password

      await UserModel.create({
        email: superAdminEmail,
        password: superAdminPassword,
        name: superAdminName,
        role: "superAdmin",
        loginId: superAdminEmail,
        isActive: true,
      });
      console.log("Super admin created successfully", superAdminPassword);
    }
  } catch (error) {
    console.error("Error seeding super admin:", error);
    process.exit(1);
  }
};

export default seedSuperAdmin;
