'use client';

import React, { useEffect, useState } from 'react';
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
import { FormikValues, withFormik } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  CreateFormValues,
  CreateFormProps,
  EventInputType,
  EventCategory,
  City,
} from './types';
import InnerForm from './components/innerForm';
import instance from '@/utils/axiosIntance';
import PageWrapper from '@/views/global/component/pageWrapper';
import { AxiosError } from 'axios';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  categoryId: Yup.string().required('Category ID is required'),
  cityId: Yup.string().required('City ID is required'),
  description: Yup.string().required('Description is required'),
  address: Yup.string().required('Address is required'),
  eventTime: Yup.date().required('Event Time is required'),
  maxBuy: Yup.number().required('Maximal ticket per transaction is required'),
  seatCategories: Yup.array().required('Description is required'),
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

export default function CreateEventView() {
  const [files, setFiles] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }

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

  async function createEvent(eventForm: CreateFormValues) {
    try {
      const form = new FormData();

      form.append('name', eventForm.name);
      form.append('type', eventForm.type);
      if (files !== null) {
        form.append('file', files);
      }
      form.append('categoryId', eventForm.categoryId);
      form.append('cityId', eventForm.cityId);
      form.append('description', eventForm.description);
      form.append('address', eventForm.address);
      form.append('eventTime', eventForm.eventTime.toUTCString());
      form.append('maxBuy', String(eventForm.maxBuy));
      form.append(
        'seatCategoriesString',
        JSON.stringify(eventForm.seatCategories),
      );

      const { data } = await instance().post('/events/create', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(data?.message);
      return data?.data.id;
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
        router.push(`/organizer/create-event/`);
      }
    }
  }

  const CreateEventForm = withFormik<CreateFormProps, CreateFormValues>({
    mapPropsToValues: (props) => ({
      name: props.intialName || '',
      type: props.initialType || EventInputType.FREE,
      categoryId: props.initialCategoryId || EventCategory.MUSIC,
      cityId: props.initialCityId || City.JAKARTA,
      description: props.initialDescription || '',
      address: props.initialAddress || '',
      eventTime: props.initialEventTime || new Date(),
      maxBuy: props.initialMaxBuy || 0,
      seatCategories: props.initialSeatCategories || [],
      categories: Object.keys(EventCategory),
      cities: Object.keys(City),
    }),
    validationSchema: registerSchema,
    enableReinitialize: true,
    async handleSubmit(
      {
        name,
        type,
        categoryId,
        cityId,
        description,
        address,
        eventTime,
        maxBuy,
        seatCategories,
      }: CreateFormValues,
      { resetForm },
    ) {
      const id = await createEvent({
        name,
        type,
        categoryId,
        cityId,
        description,
        address,
        eventTime,
        maxBuy,
        seatCategories,
      });
      resetForm();
      if (id !== undefined) {
        router.push(`/organizer/create-event/promotion/${id}`);
      }
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
                Create Your Event
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
                    Upload Photo
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => uploader(e)}
                    />
                  </Button>
                )}
                {previewImage && (
                  <Stack
                    direction="column"
                    marginBottom={0}
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
                      <img width="200px" height="200px" src={previewImage} />
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
              <CreateEventForm />
            </Stack>
          </Box>
        </Box>
      </Container>
    </PageWrapper>
  );
}
