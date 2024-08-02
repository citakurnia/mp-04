'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloudUploadOutlined } from '@mui/icons-material';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';

import { FormValues, FormProps, Role } from './types';
import InnerForm from './components/innerForm';
import instance from '@/utils/axiosIntance';
import PageWrapper from '../global/component/pageWrapper';
import Link from 'next/link';
import { AxiosError } from 'axios';

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password too short')
    .required('Password is required'),
  firstname: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  role: Yup.string().required('Role is required'),
  referralCode: Yup.string(),
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function RegisterView() {
  const [files, setFiles] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  function uploader(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];

      setFiles(image);
      setPreviewImage(URL.createObjectURL(image));
    }
  }

  function handleDeletePhoto() {
    setFiles(null);
    setPreviewImage(null);
  }

  async function register(userForm: FormValues) {
    try {
      const form = new FormData();
      form.append('email', userForm.email);
      form.append('password', userForm.password);
      if (files !== null) {
        form.append('file', files);
      }
      form.append('firstname', userForm.firstname);
      form.append('lastname', userForm.lastname);
      form.append('role', userForm.role);
      if (userForm.referralCode !== undefined) {
        form.append('referralCode', userForm.referralCode);
      }

      const { data } = await instance().post('/auth/register', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(data?.message);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      }
      router.push('/register');
    }
  }

  const LoginForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props) => ({
      email: props.initialEmail || '',
      password: props.initialPassword || '',
      firstname: props.initialFirstname || '',
      lastname: props.initialLastname || '',
      role: props.initialRole || Role.PARTICIPANT,
      referralCode: props.referralCode || '',
    }),
    validationSchema: registerSchema,
    enableReinitialize: true,
    handleSubmit(
      { email, password, firstname, lastname, role, referralCode }: FormValues,
      { resetForm },
    ) {
      register({ email, password, firstname, lastname, role, referralCode });
      resetForm();
      router.push('/login');
    },
  })(InnerForm);

  return (
    <PageWrapper sx={{ backgroundColor: 'primary.main' }}>
      <Container>
        <Box display="flex" justifyContent="center">
          <Box
            display="flex"
            sx={{
              justifyContent: 'center',
              padding: '2rem',
              backgroundColor: 'secondary.light',
            }}
            width={{ xs: '350px', md: '600px' }}
          >
            <Stack
              direction="column"
              spacing={3}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              >
                Register Here
              </Typography>
              <Box>
                {!previewImage && (
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadOutlined />}
                  >
                    Upload Avatar
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => uploader(e)}
                    />
                  </Button>
                )}
                {previewImage && (
                  <Stack
                    direction="column"
                    marginBottom={-3}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      padding={1}
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.main',
                      }}
                    >
                      <img width="90px" height="90px" src={previewImage} />
                    </Box>
                    <IconButton
                      sx={{
                        borderRadius: '10%',
                        padding: '0px',
                        margin: '4px',
                        width: '20px',
                      }}
                      onClick={handleDeletePhoto}
                    >
                      <DeleteIcon sx={{ color: 'primary.dark' }} />
                    </IconButton>
                  </Stack>
                )}
              </Box>
              <LoginForm />
              <Typography sx={{ fontSize: '12px' }}>
                Already have an account? Sign in{' '}
                <Link href="/login">here!</Link>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Container>
    </PageWrapper>
  );
}
