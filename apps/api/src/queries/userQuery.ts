import prisma from '@/prisma';
import { Prisma, User } from '@prisma/client';

class UserQuery {
  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      console.log(`Email: ${email}`);
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }
}

export default new UserQuery();
