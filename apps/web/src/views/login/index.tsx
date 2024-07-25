'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Stack } from '@mui/material';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import PageWrapper from '../global/component/pageWrapper';
import { login } from '@/_middlewares/authMiddleware';
import { FormValues, FormProps } from './types';

// import PageWrapper from '../global/components/pageWrapper';
import InnerForm from './components/innerForm';
import Image from 'next/image';
import Link from 'next/link';
import { HttpException } from '@/libs/httpException';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password too short')
    .required('Password is required'),
});

const LoginView = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const LoginForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      email: props.initialEmail || '',
      password: props.initialPassword || '',
    }),
    validationSchema: LoginSchema,
    enableReinitialize: true,
    async handleSubmit(
      { email, password }: FormValues,
      { resetForm, setSubmitting, setStatus, setErrors },
    ) {
      try {
        await login({ email, password })(dispatch);
        resetForm();
        router.push('/');
      } catch (err) {
        if (err instanceof Error) {
          setStatus({ errorMessage: err.message });
        }
      } finally {
        setSubmitting(false); // Stop the form submission
      }
    },
  })(InnerForm);

  return (
    <PageWrapper sx={{ backgroundColor: 'primary.main' }}>
      <Container
        sx={{
          maxWidth: '100vw',
        }}
      >
        <Stack direction={{ xs: 'column-reverse', md: 'row' }}>
          <Box
            display="flex"
            sx={{
              justifyContent: 'center',
              margin: '0px',
              padding: '4rem',
              backgroundColor: 'secondary.light',
            }}
          >
            <Stack spacing={4} alignItems="center" justifyContent="center">
              <Typography
                variant="h6"
                sx={{ textAlign: 'center', fontWeight: '700' }}
              >
                Log into your account
              </Typography>
              <LoginForm />
              <Typography sx={{ fontSize: '12px' }}>
                You don't have an account? Sign up{' '}
                <Link href="/register">here!</Link>
              </Typography>
            </Stack>
          </Box>
          <Box width={{ md: '1000px' }}>
            <Image
              alt="image"
              src="/login-photo.jpg"
              layout="responsive"
              width={1000}
              height={700}
              quality={100}
            />
          </Box>
        </Stack>
      </Container>
    </PageWrapper>
  );
};

export default LoginView;
