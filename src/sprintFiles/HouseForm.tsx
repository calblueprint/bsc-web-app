import { Formik, Form, FormikHelpers } from 'formik'
import { Stack, Button } from '@mui/material'
import * as Yup from 'yup'
import {
  TextInput,
} from '../components/shared/forms/CustomFormikFields'
import {
    selectHouseById,
    useAddNewHouseMutation,
    useUpdateHouseMutation
} from '../features/house/houseApiSlice'
import { useSelector } from 'react-redux'
import React from 'react'
import { RootState } from '../store/store'
import { EntityId } from '@reduxjs/toolkit'
import { House } from '../types/schema'

//** Yup allows us to define a schema, transform a value to match, and/or assert the shape of an existing value. */
//** Here, we are defining what kind of inputs we are expecting and attaching error msgs for when the input is not what we want. */
const HouseSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must have at least 1 characters'),
  houseID: Yup.string()
    .required("houseID is required")
    .min(3, "houseID must be 3 characters"),
  address: Yup.string().required('Address of house is required'),
})

const emptyHouse: Partial<House> = {
  id: '',
  name: '',
  houseID: '',
  categories: {},
  address: '',
  schedule: {},
  userPINs: {},
}

const HouseForm = ({
  setOpen,
  houseId,
}: {
  setOpen: (value: React.SetStateAction<boolean>) => void
  houseId: string,
}) => {
  //** selecting house passed into houseId */
  const house: House = useSelector(
    (state: RootState) =>
      selectHouseById(houseId)(state, houseId as EntityId) as House
  )

  //* Get API helpers to create or update a shift
  const [
    addNewHouse,
  ] = useAddNewHouseMutation()
  const [
    updateHouse,
  ] = useUpdateHouseMutation()

  const onSubmit = async (
    values: {
      id?: string
      name: string | undefined,
      houseID: string | undefined,
      address: string | undefined,
    },
    formikBag: FormikHelpers<any>
  ) => {
    const {
      id, 
      name,
      houseID,
      address,
    } = values

    let result

    const data = { data: {}}
    data.data = {
      id, 
      name,
      houseID,
      address,
    }

    if (!houseId) {
      result = await addNewHouse(data)
    } else {
      result = await updateHouse({data: data.data, houseId: houseId})
    }
    if (result) {
      console.log('success with house: ', result)
    }

    formikBag.resetForm()
    setOpen(false)
  }

  return (
    <>
      <Formik
        validationSchema={HouseSchema}
        initialValues={{
          id: house ? house.id : emptyHouse.id,
          name: house ? house.name : emptyHouse.name,
          houseID: house ? house.houseID : emptyHouse.houseID,
          address: house ? house.address : emptyHouse.address,
        }}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, }) => (
          <Form>
            <TextInput name="name" label="Full house name" />

            <TextInput name="address" label="Address of the house" />

            <TextInput name="houseID" label="ID of the house (3 letter code)" />

            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {!houseId ? 'Submit' : 'Update'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default HouseForm
