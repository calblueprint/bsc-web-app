import { TextInput } from "@/components/shared/forms/CustomFormikFields";
import { selectCurrentHouse, selectCurrentUser } from "@/features/auth/authSlice";
import { useGetScheduledShiftsQuery, useUpdateScheduledShiftMutation } from "@/features/scheduledShift/scheduledShiftApiSlice";
import { House, ScheduledShift, Shift, User } from "@/types/schema";
import { Container, Card, Button, Typography } from "@mui/material";
import { Dictionary, EntityId } from "@reduxjs/toolkit";
import { FormikHelpers, Formik, Form } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from 'yup'
import AlertComponent from "./AlertComponent";
import { useGetShiftsQuery } from "@/features/shift/shiftApiSlice";
import dayjs from "dayjs";
import { VERIFIED } from "@/utils/constants";

const VerificationSchema = Yup.object({
    pinNumber: Yup.string().required('Pin Number is required'),
})

const PinVerificationForm = ({scheduledShiftID}: {scheduledShiftID: string}) => {
    const currentHouse: House = useSelector(selectCurrentHouse) as House
    const currentUser: User = useSelector(selectCurrentUser) as User
    const [errorMessage, setErrorMessage] = useState("");

    const {
        data: scheduledShifts
    } = useGetScheduledShiftsQuery(currentHouse.houseID)

    const {
        data: shifts
    } = useGetShiftsQuery(currentHouse.houseID);

    const [
        updateScheduledShift
    ] = useUpdateScheduledShiftMutation();

    /**
     * 
     * @param pinNumber The pin number that's entered
     * @returns A boolean indicating if the pin number is valid for the given house and that the pin number doesn't belong to the current user
     */
    const verifyPinCode = (pinNumber: string) => {
        if (!(pinNumber in currentHouse.userPINs)) {
            setErrorMessage("Unidentified User PIN");
            return;
        }
        if (currentHouse.userPINs[pinNumber] === currentUser.id) {
            setErrorMessage("User PIN belongs to current user");
            return;
        }
        return true;
    }

    /**
     * 
     * @param scheduledEntityDictionary The entity dictionary for scheduledShifts
     * @param shiftEntityDictionary The entity dictionary for shifts
     * @param verifiedBy A user id for the person that verified this shift (not the current user) 
     * @returns Updates the Firebase with status = verified, verifiedBy = userID, verifiedAt = currentTime, shiftCopy = copy of the shift that this scheduledShifts points to
     */

    const updateScheduledShiftObject = async (scheduledEntityDictionary: Dictionary<ScheduledShift>, shiftEntityDictionary: Dictionary<Shift>, verifiedBy: string) => {
        // Copy the shift into the scheduledShift object
        let scheduledShiftObject = scheduledEntityDictionary[scheduledShiftID];
        if (scheduledShiftObject === undefined) {
            console.log("Given scheduled shift id is invalid");
            return;
        }
        if (scheduledShiftObject.status === VERIFIED) {
            setErrorMessage("Shift has already been verified");
            return;
        }
        let innerShiftID = scheduledShiftObject.shiftID;
        let shiftObject = shiftEntityDictionary[innerShiftID];
        if (shiftObject === undefined) {
            console.log("Inner shift id in the scheduled shfit is invalid");
            return;
        }
        const data = {
            houseId: currentHouse.houseID,
            shiftId: scheduledShiftObject.id,
            data: {
                shiftCopy: JSON.parse(JSON.stringify(shiftObject)) as Shift,
                status: VERIFIED,
                verifiedBy: verifiedBy,
                verifiedAt: dayjs().toString()
            }
        }
        await updateScheduledShift(data);
        console.log("success");
    }

    /**
     * 
     * @param pinNumber - The pin number that's entered
     * @returns Checks the the pin code is valid and then updates the firebase.
     */
    const onSubmit = async (values: {pinNumber: string}, formikBag: FormikHelpers<any>) => { 
        const { pinNumber } = values;
        if (scheduledShifts === undefined || shifts === undefined) {
            console.log("Scheduled Shifts / Shifts not loaded");
            return;
        }
        if (!verifyPinCode(pinNumber)) {
            return;
        }
        let verifiedBy = currentHouse.userPINs[pinNumber];
        await updateScheduledShiftObject(scheduledShifts.entities, shifts.entities, verifiedBy);
    }

    return (
        <Container sx={{
            height: '100vh',
            backgroundColor: '#f3f5f6',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'center'
        }}>
            <Card 
             sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
                paddingX: 5,
             }}>
                <Typography component="h5" variant="h5" sx={{ marginTop: 3 }}>
                    Pin Number
                </Typography>
                <Formik
                    validationSchema = {VerificationSchema}
                    initialValues = {{
                        pinNumber: ""
                    }}
                    onSubmit = {onSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <TextInput name="pinNumber" label="Pin Number" />
                            <Button type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting}
                            >Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card> 
            {
                errorMessage !== "" &&
                <AlertComponent message = {errorMessage} setErrorMessage = {setErrorMessage} />
            }  
        </Container>
    )
}

export default PinVerificationForm;