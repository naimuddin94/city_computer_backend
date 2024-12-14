import * as bcrypt from "bcrypt";
import config from "../config";
import { prisma } from "../lib";

const seedingAdmin = async () => {
  try {
    const isAdminExist = await prisma.user.findUnique({
      where: {
        email: config.admin_email,
      },
    });

    const hashPassword = await bcrypt.hash(
      config.admin_password as string,
      Number(config.bcrypt_salt_rounds)
    );

    if (!isAdminExist) {
      return prisma.user.create({
        data: {
          name: "admin",
          email: config.admin_email as string,
          password: hashPassword,
          image: config.admin_profile_photo,
          role: "admin",
        },
      });
    }
  } catch (error) {
    console.log("something went wrong while seeding admin", error);
  }
};

export default seedingAdmin;
