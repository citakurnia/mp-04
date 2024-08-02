import React from 'react';
import {
  FormikProps,
  FormikValues,
  Form,
  Field,
  FieldArray,
  FormikErrors,
} from 'formik';
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
  Divider,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  CreatePromotionsValues,
  CreatePromotionValues,
  PromotionType,
  RewardType,
} from '../types';

export default function InnerForm(props: FormikProps<CreatePromotionsValues>) {
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
        <FieldArray name="promotions">
          {({ push, remove }) => (
            <Box>
              {values.promotions.map((promotion, index) => (
                <Stack key={index} spacing={3} style={{ marginTop: '20px' }}>
                  <Stack spacing={0}>
                    <FormControl fullWidth>
                      <InputLabel>Promotion Type</InputLabel>
                      <Field name={`promotions.${index}.type`}>
                        {({ field }: { field: any }) => (
                          <Select
                            {...field}
                            label="Promotion Type"
                            onChange={handleChange}
                          >
                            {Object.keys(PromotionType).map((key) => (
                              <MenuItem
                                key={key}
                                value={
                                  PromotionType[
                                    key as keyof typeof PromotionType
                                  ]
                                }
                              >
                                {key}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </FormControl>
                    <FormControl>
                      <TextField
                        name={`promotions.${index}.name`}
                        label="Name"
                        type="text"
                        margin="normal"
                        value={promotion.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ marginTop: '25px' }}
                      />
                      {touched.promotions?.[index]?.name &&
                        errors.promotions &&
                        (
                          errors.promotions as FormikErrors<CreatePromotionValues>[]
                        )[index]?.name && (
                          <Typography
                            sx={{
                              color: 'primary.dark',
                              fontSize: '12px',
                            }}
                          >
                            {errors.promotions &&
                              (
                                errors.promotions as FormikErrors<CreatePromotionValues>[]
                              )[index]?.name}
                          </Typography>
                        )}
                    </FormControl>
                    <FormControl>
                      <TextField
                        name={`promotions.${index}.description`}
                        label="Description"
                        type="text"
                        margin="normal"
                        value={promotion.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.promotions?.[index]?.description &&
                        errors.promotions &&
                        (
                          errors.promotions as FormikErrors<CreatePromotionValues>[]
                        )[index]?.description && (
                          <Typography
                            sx={{
                              color: 'primary.dark',
                              fontSize: '12px',
                            }}
                          >
                            {errors.promotions &&
                              (
                                errors.promotions as FormikErrors<CreatePromotionValues>[]
                              )[index]?.description}
                          </Typography>
                        )}
                    </FormControl>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginTop: '12px' }}
                  >
                    <Box>
                      <InputLabel>
                        <Typography fontSize="12px">Start Date</Typography>
                      </InputLabel>
                      <DatePicker
                        selected={values.promotions[index].startedAt}
                        onChange={(date) =>
                          setFieldValue(`promotions[${index}].startedAt`, date)
                        }
                        showTimeSelect
                        dateFormat="Pp"
                        customInput={<TextField fullWidth />}
                      />
                    </Box>
                    <Box width={10} />
                    <Box>
                      <InputLabel>
                        <Typography fontSize="12px">End Date</Typography>
                      </InputLabel>
                      <DatePicker
                        selected={values.promotions[index].finishedAt}
                        onChange={(date) =>
                          setFieldValue(`promotions[${index}].finishedAt`, date)
                        }
                        showTimeSelect
                        dateFormat="Pp"
                        customInput={<TextField fullWidth />}
                      />
                    </Box>
                  </Stack>
                  <Box style={{ marginTop: '30px' }}>
                    <FormControl fullWidth>
                      <InputLabel>Reward Type</InputLabel>
                      <Field name={`promotions.${index}.rewardType`}>
                        {({ field }: { field: any }) => (
                          <Select
                            {...field}
                            label="Reward Type"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {Object.keys(RewardType).map((key) => (
                              <MenuItem
                                key={key}
                                value={
                                  RewardType[key as keyof typeof RewardType]
                                }
                              >
                                {key}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </FormControl>
                  </Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    style={{ marginTop: '12px' }}
                  >
                    <FormControl>
                      <TextField
                        name={`promotions.${index}.discount`}
                        label="Discount"
                        type="number"
                        margin="normal"
                        value={values.promotions[index].discount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.promotions?.[index]?.discount &&
                        errors.promotions &&
                        (
                          errors.promotions as FormikErrors<CreatePromotionValues>[]
                        )[index]?.discount && (
                          <Typography
                            sx={{
                              color: 'primary.dark',
                              fontSize: '12px',
                            }}
                          >
                            {errors.promotions &&
                              (
                                errors.promotions as FormikErrors<CreatePromotionValues>[]
                              )[index]?.discount}
                          </Typography>
                        )}
                    </FormControl>
                    <Box width={10} />
                    <FormControl>
                      <TextField
                        name={`promotions.${index}.rewardQuota`}
                        label="Quota"
                        type="number"
                        margin="normal"
                        value={values.promotions[index].rewardQuota}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={3}
                    style={{ marginTop: '12px' }}
                  >
                    {index > 0 && (
                      <Button
                        sx={{ backgroundColor: 'primary.light' }}
                        onClick={() => remove(index)}
                      >
                        Remove Promotion
                      </Button>
                    )}
                    <Button
                      sx={{ backgroundColor: 'secondary.main' }}
                      onClick={() =>
                        push({
                          name: '',
                          description: '',
                          startedAt: new Date(),
                          finishedAt: new Date(),
                          type: PromotionType['Time-based'],
                          discount: 10,
                          rewardType: RewardType['Coupon Percent'],
                          rewardQuota: 20,
                        })
                      }
                    >
                      Add Promotion
                    </Button>
                  </Stack>
                  <Divider
                    sx={{ backgroundColor: 'secondary.light' }}
                    style={{
                      marginTop: '15px',
                      marginBottom: '15px',
                    }}
                  />
                </Stack>
              ))}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ marginTop: '15px', marginBottom: '15px' }}
              >
                Submit
              </Button>
            </Box>
          )}
        </FieldArray>
      </Form>
    </Box>
  );
}
