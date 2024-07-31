'use client';

import * as Yup from 'yup';
import { useAppSelector } from '@/libs/hooks';
import instance from '@/utils/axiosIntance';
import { useEffect, useState } from 'react';
import { EventProps } from '../types';
import { useRouter } from 'next/navigation';
import { Box, Container, Stack, Typography } from '@mui/material';
import PageWrapper from '@/views/global/component/pageWrapper';
import {
  CreatePromotionsProps,
  CreatePromotionsValues,
  CreatePromotionValues,
  PromotionType,
  RewardType,
} from './types';
import { withFormik } from 'formik';
import InnerForm from './components/innerForm';
import axios, { AxiosError } from 'axios';

const promotionsSchema = Yup.object().shape({
  promotions: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name required'),
      description: Yup.string().required('Description required'),
      startedAt: Yup.date(),
      finishedAt: Yup.date(),
      type: Yup.string().required('Type is required'),
      discount: Yup.number().required('Discount is required'),
      rewardType: Yup.string().required('Reward type is required'),
      rewardQuota: Yup.number().min(1),
    }),
  ),
});

export default function CreatePromotionView({ eventId }: { eventId: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  async function checkValidEvents() {
    try {
      const response = await instance().get(`events/${user.id}`);
      const events: Array<number> = response.data.data.map(
        (data: EventProps) => {
          return data.id;
        },
      );
      if (!events.includes(Number(eventId))) {
        router.push('/organizer/dashboard');
      }
      console.log(response.data.data);
      setIsMounted(true);
    } catch (err) {
      console.log('Error');
    }
  }

  useEffect(() => {
    checkValidEvents();
  }, []);

  if (!isMounted) {
    return null;
  }

  async function createPromotions(promotionsForm: CreatePromotionsValues) {
    try {
      const form = new FormData();

      form.append('promotions', JSON.stringify(promotionsForm.promotions));

      console.log(JSON.stringify(promotionsForm.promotions));
      const { data } = await instance().post(
        `/events/promotion/${eventId}`,
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      alert(data?.message);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            error.response.data.message || 'Server responded with an error';
        } else if (error.request) {
          errorMessage = 'No response received from server';
        }
      }
      console.log(errorMessage);
    }
  }

  const CreateEventForm = withFormik<
    CreatePromotionsProps,
    CreatePromotionsValues
  >({
    mapPropsToValues: (props) => {
      const promotions = props.promotions.map((promo) => ({
        name: promo.initialName || '',
        description: promo.initialDescription || '',
        startedAt: promo.initialStartedAt
          ? new Date(promo.initialStartedAt)
          : new Date(),
        finishedAt: promo.initialFinishedAt
          ? new Date(promo.initialFinishedAt)
          : new Date(),
        type: promo.initialType || PromotionType['Time-based'], // Ensure PromotionType is defined and used properly
        discount: promo.initialDiscount || 10,
        rewardType: promo.initialRewardType || RewardType['Coupon Percent'], // Ensure RewardType is defined and used properly
        rewardQuota: promo.initialRewardQuota || 20,
      }));

      return { promotions };
    },
    validationSchema: promotionsSchema,
    enableReinitialize: true,
    async handleSubmit(values: CreatePromotionsValues, { resetForm }) {
      await createPromotions({ promotions: values.promotions });
      resetForm();
      router.push('/organizer/dashboard');
    },
  })(InnerForm);

  const promotionsProps = {
    promotions: [
      {
        initialName: '',
        initialDescription: '',
        initialStartedAt: new Date(),
        initialFinishedAt: new Date(),
        initialType: PromotionType['Time-based'],
        initialDiscount: 10,
        initialRewardType: RewardType['Coupon Percent'],
        initialRewardQuota: 20,
      },
    ],
  };

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
            width={{ xs: '350px', md: '900px' }}
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
                Create Promotion
              </Typography>
              <CreateEventForm {...promotionsProps} />
            </Stack>
          </Box>
        </Box>
      </Container>
    </PageWrapper>
  );
}
