'use client';
import { Box, Grid, Stack, Typography } from '@mui/material';
import DashboardPageWrapper from '../global/component/menubar';
import PageWrapper from '../global/component/pageWrapper';
import instance from '@/utils/axiosIntance';
import { useState, useEffect } from 'react';
import { CouponItems, PointItems } from './types';
import moment from 'moment';

export default function RewardView() {
  const [isMounted, setIsMounted] = useState(false);
  const [points, setPoints] = useState<Array<PointItems>>([]);
  const [coupons, setCoupons] = useState<Array<CouponItems>>([]);

  async function fetchData() {
    try {
      const resultPoints = await instance().get(
        `${process.env.API_URL}/rewards/points`,
      );
      const resultCoupons = await instance().get(
        `${process.env.API_URL}/rewards/coupons`,
      );
      setPoints(resultPoints.data.data);
      setCoupons(resultCoupons.data.data);
      setIsMounted(true);
    } catch (err: any) {
      console.log('Data is not fetched');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <PageWrapper>
        <DashboardPageWrapper>
          <Box
            sx={{
              backgroundColor: 'secondary.light',
              borderRadius: '10px',
              padding: '20px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack justifyContent="center" alignItems="center" spacing={2}>
                  <Typography fontSize="18px" fontWeight={700}>
                    Points
                  </Typography>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    {points.map((point) => (
                      <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          backgroundColor: 'primary.light',
                          padding: '10px',
                          borderRadius: '10px',
                        }}
                      >
                        <Typography fontSize="15px" fontWeight={600}>
                          {point.value}
                        </Typography>
                        <Typography fontSize="13px">Validity</Typography>
                        <Typography fontSize="13px">
                          {moment(point.createdAt).format('L')} -{' '}
                          {moment(point.expiredAt).format('L')}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack justifyContent="center" alignItems="center" spacing={2}>
                  <Typography fontSize="18px" fontWeight={700}>
                    Coupons
                  </Typography>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    {coupons.map((coupon) => (
                      <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          backgroundColor: 'primary.light',
                          padding: '10px',
                          borderRadius: '10px',
                        }}
                      >
                        <Typography fontSize="15px" fontWeight={600}>
                          {coupon.promotion.name}
                        </Typography>
                        <Typography fontSize="13px">
                          {coupon.promotion.description}
                        </Typography>
                        <Box height="6px" />
                        <Typography fontSize="13px">Validity</Typography>
                        <Typography fontSize="13px">
                          {moment(coupon.createdAt).format('L')} -{' '}
                          {moment(coupon.expiredAt).format('L')}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </DashboardPageWrapper>
      </PageWrapper>
    </>
  );
}
