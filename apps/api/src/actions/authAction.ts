import { API_KEY } from '@/config';
import { HttpException } from '@/errors/httpException';
import { genSalt, hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { generate } from 'referral-codes';
import rewardAction from './rewardAction';
import authQuery from '@/queries/authQuery';
import userQuery from '@/queries/userQuery';
import referralQuery from '@/queries/referralQuery';
import type { UserItems } from '@/interfaces/userInterface';
import type { AuthItems } from '@/interfaces/authInterface';

class AuthAction {
  public async registerAction(user: AuthItems): Promise<User> {
    try {
      const findUser = await userQuery.getUserByEmail(user.email);
      if (findUser != null) {
        throw new HttpException(500, 'User with that email already exist');
      }

      const referral = generate({
        length: 8,
        count: 1,
      });

      function capitalize(str: string): string {
        const stringArray = str.split(/\s+/);

        const newStringArray = stringArray.map((str) => {
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        });
        return newStringArray.join(' ');
      }

      const salt = await genSalt(10);
      const hashPass = await hash(user.password, salt);

      const queryInput: UserItems = {
        ...user,
        firstname: capitalize(user.firstname),
        lastname: capitalize(user.lastname),
        password: hashPass,
        referral: referral[0],
      };

      if (user.referralCode != undefined) {
        try {
          const referrerId = await referralQuery.getReferrerId(
            user.referralCode,
          );
          queryInput.referrerId = referrerId;
        } catch (err) {
          console.log('Referral code invalid');
        }
      }

      const result = await authQuery.registerQuery(queryInput);

      if (result.referrerId !== null) {
        await rewardAction.createReferralReward(result.referrerId, result.id);
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async loginAction(email: string, password: string): Promise<string> {
    try {
      const findUser = await userQuery.getUserByEmail(email);

      if (findUser == null) {
        throw new HttpException(503, "User with that email doesn't exist");
      }

      const isValid = await compare(password, findUser.password);

      if (!isValid) {
        throw new HttpException(503, 'Incorrect password');
      }

      const payload = {
        id: findUser.id,
        email: findUser.email,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        isVerified: findUser.isVerified,
        role: findUser.role,
        avatar: findUser.avatarFilename,
        referral: findUser.referral,
      };

      const token = sign(payload, String(API_KEY), { expiresIn: '1hr' });

      return token;
    } catch (err) {
      throw err;
    }
  }

  public async refreshTokenAction(email: string): Promise<string> {
    try {
      const findUser = await userQuery.getUserByEmail(email);

      if (findUser == null) {
        throw new HttpException(500, 'Something went wrong');
      }

      const payload = {
        id: findUser.id,
        email: findUser.email,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        isVerified: findUser.isVerified,
        role: findUser.role,
        avatar: findUser.avatarFilename,
        referral: findUser.referral,
      };

      const token = sign(payload, String(API_KEY), { expiresIn: '1hr' });

      return token;
    } catch (err) {
      throw err;
    }
  }

  public async verifyAction(email: string): Promise<void> {
    try {
      const findUser = await userQuery.getUserByEmail(email);

      if (findUser == null) {
        throw new HttpException(500, 'User not found');
      } else if (findUser.isVerified) {
        throw new HttpException(501, 'User is already verified');
      }

      await authQuery.verifyQuery(findUser.email);
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthAction();
