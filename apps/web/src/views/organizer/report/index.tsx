'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { useEffect, useState } from 'react';
import instance from '@/utils/axiosIntance';
import DashboardPageWrapper from '@/views/global/component/menubar';
import PageWrapper from '@/views/global/component/pageWrapper';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const fetchChartData = async (url: string) => {
  try {
    const response = await instance().get(url);
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
        },
      },
    },
  },
};

export default function ReportView() {
  const [dailyData, setDailyData] = useState<{
    totalAmount: ChartData | null;
    totalTransactions: ChartData | null;
  } | null>(null);
  const [weeklyData, setWeeklyData] = useState<{
    totalAmount: ChartData | null;
    totalTransactions: ChartData | null;
  } | null>(null);
  const [yearlyData, setYearlyData] = useState<{
    totalAmount: ChartData | null;
    totalTransactions: ChartData | null;
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<'daily' | 'weekly' | 'yearly'>('daily');

  useEffect(() => {
    const loadData = async () => {
      const daily = await fetchChartData(
        `${process.env.API_URL}/orders/transactions/aggregate/daily`,
      );
      const weekly = await fetchChartData(
        `${process.env.API_URL}/orders/transactions/aggregate/weekly`,
      );
      const yearly = await fetchChartData(
        `${process.env.API_URL}/orders/transactions/aggregate/yearly`,
      );

      setDailyData(daily);
      setWeeklyData(weekly);
      setYearlyData(yearly);
    };

    loadData();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleChange = (
    event: SelectChangeEvent<'daily' | 'weekly' | 'yearly'>,
  ) => {
    setView(event.target.value as 'daily' | 'weekly' | 'yearly');
  };

  return (
    <>
      <PageWrapper>
        <DashboardPageWrapper>
          <Box
            sx={{
              backgroundColor: 'secondary.light',
              borderRadius: '10px',
              padding: '20px',
              paddingTop: '10px',
            }}
          >
            <Box>
              <FormControl margin="normal" sx={{ width: '250px' }}>
                <InputLabel id="view-select-label">Select View</InputLabel>
                <Select
                  labelId="view-select-label"
                  value={view}
                  onChange={handleChange}
                  label="Select View"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {view === 'daily' ? (
              <Box>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="700">
                    Daily Total Amount
                  </Typography>
                  {dailyData?.totalAmount && (
                    <Line data={dailyData.totalAmount} options={chartOptions} />
                  )}
                </Box>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="700">
                    Daily Total Transaction
                  </Typography>
                  {dailyData?.totalTransactions && (
                    <Line
                      data={dailyData.totalTransactions}
                      options={chartOptions}
                    />
                  )}
                </Box>{' '}
              </Box>
            ) : view === 'weekly' ? (
              <Box>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="700">
                    Weekly Total Amount
                  </Typography>
                  {weeklyData?.totalAmount && (
                    <Line
                      data={weeklyData.totalAmount}
                      options={chartOptions}
                    />
                  )}
                </Box>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="700">
                    Weekly Total Transaction
                  </Typography>
                  {weeklyData?.totalTransactions && (
                    <Line
                      data={weeklyData.totalTransactions}
                      options={chartOptions}
                    />
                  )}
                </Box>
              </Box>
            ) : (
              <Box>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="700">
                    Yearly Total Amount
                  </Typography>
                  {yearlyData?.totalAmount && (
                    <Line
                      data={yearlyData.totalAmount}
                      options={chartOptions}
                    />
                  )}
                </Box>
                <Box padding={2}>
                  <Typography variant="h6" fontWeight="700">
                    Yearly Total Transaction
                  </Typography>
                  {yearlyData?.totalTransactions && (
                    <Line
                      data={yearlyData.totalTransactions}
                      options={chartOptions}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </DashboardPageWrapper>
      </PageWrapper>
    </>
  );
}
