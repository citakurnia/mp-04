import {
  FormControl,
  FormLabel,
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import { FormikProps, Form, Field } from 'formik';
import { FormValues, Role } from '../types';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';
import { useState } from 'react';

export default function InnerForm(props: FormikProps<FormValues>) {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = props;
  const [referralStatus, setReferralStatus] = useState<string | null>(null);

  const handleCheckReferral = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/referral/${values.referralCode}`,
      );

      if (response.data.data > 0) {
        setReferralStatus('Referral code is valid');
      }
    } catch (error) {
      setReferralStatus('Referral code is invalid');
    }
  };

  return (
    <Box
      sx={{
        minWidth: '300px',
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
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
            <FormLabel htmlFor="password">Password</FormLabel>
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
          <FormControl>
            <FormLabel htmlFor="firstname">First name</FormLabel>
            <Field
              name="firstname"
              type="firstname"
              onChange={handleChange}
              value={values.firstname}
            />
            {touched.firstname && errors.firstname && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.firstname}
              </Typography>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastname">Last name</FormLabel>
            <Field
              name="lastname"
              type="lastname"
              onChange={handleChange}
              value={values.lastname}
            />
            {touched.lastname && errors.lastname && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.lastname}
              </Typography>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>What are you? (choose one)</FormLabel>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={5}
            >
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color={
                    values.role === Role.PARTICIPANT ? 'primary' : 'default'
                  }
                  onClick={() => setFieldValue('role', Role.PARTICIPANT)}
                >
                  <PersonIcon sx={{ fontSize: '60px' }} />
                </IconButton>
                Participant
              </Stack>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color={values.role === Role.ORGANIZER ? 'primary' : 'default'}
                  onClick={() => setFieldValue('role', Role.ORGANIZER)}
                >
                  <EventIcon sx={{ fontSize: '60px' }} />
                </IconButton>
                Event Organizer
              </Stack>
            </Stack>
            {touched.role && errors.role && (
              <Typography color="error">{errors.role}</Typography>
            )}
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="referralCode">
              Referral code (if you have)
            </FormLabel>
            <Stack direction="row" justifyContent="space-between">
              <Field
                name="referralCode"
                type="referralCode"
                onChange={handleChange}
                value={values.referralCode}
                style={{ width: '220px' }}
              />
              <Button
                variant="outlined"
                sx={{ padding: '0px' }}
                onClick={handleCheckReferral}
              >
                Check
              </Button>
            </Stack>
            <Typography
              sx={{
                color: 'secondary.dark',
                fontSize: '12px',
              }}
            >
              {referralStatus && <div>{referralStatus}</div>}
            </Typography>
          </FormControl>
          <Button
            variant="outlined"
            sx={{
              marginTop: '15px',
            }}
            type="submit"
            disabled={isSubmitting}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>
              Register
            </Typography>
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}
