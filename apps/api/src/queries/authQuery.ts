import prisma from '@/prisma';
import * as handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { sign } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { transporter } from '@/libs/nodemailer';
import { FE_URL, API_KEY } from '@/config';
import { UserItems } from '@/interfaces/userInterface';
import rewardAction from '@/actions/rewardAction';

class AuthQuery {
  private async sendRegistrationEmail(
    email: string,
    isVerified: boolean,
  ): Promise<void> {
    try {
      const payload = {
        email,
        isVerified,
      };

      const token = sign(payload, String(API_KEY), {
        expiresIn: '10m',
      });

      const templatePath = path.join(
        __dirname,
        '../templates',
        'registrationEmail.hbs',
      );
      const urlVerify = `${FE_URL}/verify?token=${token}`;
      const templateSource = fs.readFileSync(templatePath, 'utf-8');

      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        email,
        url: urlVerify,
      });

      await transporter.sendMail({
        from: 'sender address',
        to: email,
        subject: 'Welcome to EventCreate',
        html,
      });
    } catch (err) {
      throw err;
    }
  }

  public async registerQuery(user: UserItems): Promise<User> {
    try {
      const t = await prisma.$transaction(async (prisma) => {
        try {
          const result: User = await prisma.user.create({
            data: {
              email: user.email,
              password: user.password,
              avatarFilename: user.avatarFilename,
              role: user.role,
              referral: user.referral,
              firstname: user.firstname,
              lastname: user.lastname,
              referrerId: user.referrerId,
              isVerified: false,
              createdAt: new Date(),
              modifiedAt: new Date(),
            },
          });

          // await this.sendRegistrationEmail(result.email, result.isVerified);

          return result;
        } catch (err) {
          throw err;
        }
      });

      return t;
    } catch (err) {
      throw err;
    }
  }

  public async verifyQuery(email: string): Promise<void> {
    try {
      await prisma.$transaction(async (prisma) => {
        try {
          await prisma.user.update({
            data: {
              isVerified: true,
            },
            where: { email },
          });
        } catch (err) {
          throw err;
        }
      });
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthQuery();
