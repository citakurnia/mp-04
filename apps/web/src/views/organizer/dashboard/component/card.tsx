// components/EventCard.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActionArea,
  Stack,
  Chip,
} from '@mui/material';
import { EventProps } from '../../types';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const EventCard = ({ event }: { event: EventProps }) => {
  const posterUrl = `${process.env.IMAGE_URL}/events/${event?.photoPoster}`;
  const eventDate = new Date(event.eventTime);
  const date = moment(eventDate).format('LL');
  const time = moment(eventDate).format('LT');
  const router = useRouter();

  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardActionArea
        onClick={() =>
          router.push(`/organizer/dashboard/event-details/${event.id}`)
        }
      >
        <CardMedia
          component="img"
          alt={event.name}
          image={posterUrl}
          sx={{
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {event.name}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="column">
              <Typography variant="body2" color="text.secondary">
                {date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {time}
              </Typography>
            </Stack>
            {new Date() < eventDate ? (
              <Chip label="On Going" sx={{ bgcolor: 'primary.light' }} />
            ) : (
              <Chip label="Done" sx={{ bgcolor: 'info.light' }} />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;
