import {
  FormControl,
  FormLabel,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { FormikProps, Form, Field } from 'formik';
import { FormValues } from '../types';
import { useState } from 'react';

export default function InnerForm(props: FormikProps<FormValues>) {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isSubmitting,
    status,
  } = props;
  const errorMessage = status?.errorMessage || '';

  return (
    <Box
      sx={{
        minWidth: '300px',
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="email">Email :</FormLabel>
            <Field
              name="email"
              type="email"
              onChange={handleChange}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.email}
              </Typography>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password :</FormLabel>
            <Field
              name="password"
              type="password"
              onChange={handleChange}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.password}
              </Typography>
            )}
          </FormControl>
          <Button
            sx={{
              marginTop: '15px',
            }}
            variant="outlined"
            type="submit"
            disabled={isSubmitting}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>
              Login
            </Typography>
          </Button>
        </Stack>

        {errorMessage && (
          <Typography
            sx={{
              color: 'primary.dark',
              fontSize: '12px',
            }}
          >
            {errorMessage}
          </Typography>
        )}
      </Form>
    </Box>
  );
}
