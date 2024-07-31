// components/innerForm.tsx
import React from 'react';
import { FormikProps, FormikValues, Form, Field, FieldArray } from 'formik';
import {
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Button,
  Box,
  Typography,
  FormLabel,
  Stack,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  EventCategory,
  SeatCategory,
  City,
  CreateFormValues,
  EventInputType,
} from '../types';

export default function InnerForm(props: FormikProps<CreateFormValues>) {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = props;

  return (
    <Box width={{ xs: '350px', md: '450px' }}>
      <Form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <TextField
              name="name"
              label="Event Name"
              type="name"
              onChange={handleChange}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.name}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Field name="type">
              {({ field }: { field: any }) => (
                <Select
                  {...field}
                  label="Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {Object.keys(EventInputType).map((key) => (
                    <MenuItem
                      key={key}
                      value={EventInputType[key as keyof typeof EventInputType]}
                    >
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Field>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Field name="categoryId">
              {({ field }: { field: any }) => (
                <Select
                  {...field}
                  label="Category"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {Object.keys(EventCategory).map((key) => (
                    <MenuItem
                      key={key}
                      value={EventCategory[key as keyof typeof EventCategory]}
                    >
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Field>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Field name="cityId">
              {({ field }: { field: any }) => (
                <Select
                  {...field}
                  label="City"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {Object.keys(City).map((key) => (
                    <MenuItem key={key} value={City[key as keyof typeof City]}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Field>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              name="address"
              label="Address"
              type="address"
              onChange={handleChange}
              value={values.address}
            />
            {touched.address && errors.address && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.address}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <TextField
              name="description"
              label="Description"
              type="description"
              onChange={handleChange}
              value={values.description}
            />
            {touched.description && errors.description && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.description}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <TextField
              name="maxBuy"
              label="Maximal Buy"
              fullWidth
              margin="normal"
              value={values.maxBuy}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.maxBuy && errors.maxBuy && (
              <Typography
                sx={{
                  color: 'primary.dark',
                  fontSize: '12px',
                }}
              >
                {errors.maxBuy}
              </Typography>
            )}
          </FormControl>

          <Box>
            <InputLabel>Event Time</InputLabel>
            <DatePicker
              selected={values.eventTime}
              onChange={(date) => setFieldValue('eventTime', date)}
              showTimeSelect
              dateFormat="Pp"
              customInput={<TextField fullWidth />}
            />
          </Box>

          <FieldArray name="seatCategories">
            {({ push, remove }) => (
              <Box margin="normal">
                <Typography variant="h6">Seat Categories</Typography>
                {values.type === EventInputType.FREE ? (
                  <>
                    <TextField
                      name="seatCategories[0].maxSeats"
                      label="Seats Quota"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={values.seatCategories[0]?.maxSeats}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Typography variant="body2" color="textSecondary">
                      Seat categories are not applicable for free events.
                    </Typography>
                  </>
                ) : values.type === EventInputType['PAID & FREE SEATING'] ? (
                  <>
                    <Box marginBottom={2}>
                      <TextField
                        name="seatCategories[0].price"
                        label="Price"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={values.seatCategories[0]?.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <TextField
                        name="seatCategories[0].maxSeats"
                        label="Seats Quota"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={values.seatCategories[0]?.maxSeats}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    {values.seatCategories.map(
                      (seatCategory: SeatCategory, index: number) => (
                        <Box key={index} marginBottom={2}>
                          <TextField
                            name={`seatCategories.${index}.name`}
                            label="Category Name"
                            fullWidth
                            margin="normal"
                            value={seatCategory.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <TextField
                            name={`seatCategories.${index}.price`}
                            label="Price"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={seatCategory.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <TextField
                            name={`seatCategories.${index}.maxSeats`}
                            label="Seats Quota"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={seatCategory.maxSeats}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            color="error"
                          >
                            Remove
                          </Button>
                        </Box>
                      ),
                    )}
                    <Button
                      type="button"
                      onClick={() => push({ name: '', price: 0, maxSeats: 0 })}
                    >
                      Add Seat Category
                    </Button>
                  </>
                )}
              </Box>
            )}
          </FieldArray>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}
