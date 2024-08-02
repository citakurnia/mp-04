import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios';
import instance from './utils/axiosIntance';
import { User } from './interfaces/userInterface';
import { Role } from './views/register/types';
import parseJWT from './utils/parseJwt';
import { deleteCookie } from 'cookies-next';

export async function middleware(request: NextRequest) {
  const { pathname }: { pathname: string } = request.nextUrl;
  const token = request.cookies.get('refresh-token')?.value;
  console.log(`token: ${token}`);
  const response = NextResponse.next();

  function redirectUser(role: string) {
    if (role == Role.PARTICIPANT) {
      return NextResponse.redirect(new URL('/', request.url));
    } else if (role == Role.ORGANIZER) {
      return NextResponse.redirect(
        new URL('/organizer/dashboard', request.url),
      );
    } else {
      deleteCookie('access-token');
      deleteCookie('refresh-token');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (token !== undefined) {
    try {
      const res = await instance().get('/auth', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // set new access-token upon web refresh
      response.cookies.set('access-token', res.data.access_token, {
        httpOnly: false,
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(
          'Token validation failed:',
          err.response?.data || err.message,
        );
      }
      console.log(err);
    }

    const user: User = parseJWT(token);

    // protective route to /dashboard
    if (pathname.startsWith('/organizer') && user.role !== Role.ORGANIZER) {
      return redirectUser(user.role);
    }

    return response;
  } else if (pathname.startsWith('/organizer') && token == undefined) {
    const responseWithClearCookies = NextResponse.redirect(
      new URL('/login', request.url),
    );
    responseWithClearCookies.cookies.delete('refresh-token');
    responseWithClearCookies.cookies.delete('access-token');

    return responseWithClearCookies;
  }
}

export const config = {
  matcher: ['/', '/organizer/:path*'],
  // "/auth", "/login", "/verification", "/register", "/admin", "/"],
};
