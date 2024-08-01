import { Typography, Box, Stack, Divider } from '@mui/material';
import { EventPropsDetail } from '../types';
import moment from 'moment';

export default function EventDetails({
  eventDetails,
}: {
  eventDetails: EventPropsDetail;
}) {
  const date = moment(eventDetails.eventTime).format('LL');
  const time = moment(eventDetails.eventTime).format('LT');

  return (
    <>
      {/* <Typography variant="h6" fontWeight="700">
        Event Details
      </Typography> */}
      <Box height={10} />
      <Typography fontSize="18px" fontWeight="600" color="primary.main">
        {eventDetails.name}
      </Typography>
      <Typography>{eventDetails.address}</Typography>
      <Typography>
        {date} | {time}
      </Typography>
      <Box height={10} />
      <Typography fontSize="15px" fontWeight="700">
        Description
      </Typography>
      <Typography fontSize="13px">{eventDetails.description}</Typography>
      <Box height={10} />
      <Stack
        sx={{ backgroundColor: 'primary.light', borderRadius: '20px' }}
        justifyContent="center"
        alignItems="center"
        padding={1}
      >
        {eventDetails.seatCategory.map((category, index) => (
          <>
            {category.name !== 'Free' ? (
              <>
                <Typography fontSize="15px" fontWeight="700">
                  {category.name}
                </Typography>
                <Typography fontSize="14px">Rp {category.price}</Typography>
              </>
            ) : (
              <Typography fontWeight={700}>Free</Typography>
            )}
            <Typography fontSize="14px">
              Maximum seats: {category.maxSeats}
            </Typography>
            {index !== eventDetails.seatCategory.length - 1 && (
              <Box height={10} />
            )}
          </>
        ))}
      </Stack>
      <Box height={15} />
      <Typography fontWeight="700">Promotion</Typography>
      <Box height={5} />
      {eventDetails.promotions.length > 0 ? (
        eventDetails.promotions.map((promo) => (
          <>
            <Typography fontSize="15px" fontWeight="700" color="info.dark">
              {promo.name}
            </Typography>
            <Typography fontSize="14px">{promo.description}</Typography>
            <Typography fontSize="14px">
              Period: {moment(promo.startedAt).format('LL')} -{' '}
              {moment(promo.finishedAt).format('LL')}
            </Typography>
            <Box height={10} />
          </>
        ))
      ) : (
        <>No promotion available</>
      )}
    </>
  );
}
