import { TextInput } from "@/components/shared/forms/CustomFormikFields";
import { Box, Button, Card, Container, Typography } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from 'yup'
import BscLogo from '../assets/bsclogo.png'
import Image from 'next/image'
import Copyright from "@/components/shared/Copyright";
import { useGetAuthorizedUsersQuery, useUpdateAuthorizedUserMutation } from "@/features/authorizedUser/authorizedUserApiSlice";
import { Dictionary, EntityId } from "@reduxjs/toolkit";
import { AuthorizedUser } from "@/types/schema";
import { useAddNewUserMutation } from "@/features/user/userApiSlice";

const RegisterAccountSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password:  Yup.string().required('Password is required'),
    confirmPassword: Yup.string().required('Password is required')
})

const RegisterAccountForm = () => {
    const {
        data: dataAuthorizedUsers,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetAuthorizedUsersQuery({})

    const [
        addNewUser,
        {

        }
    ] = useAddNewUserMutation({})


    const [
        updateAuthorizedUser,
        {
          // isLoading: isLoadingUpdateShift,
          // isSuccess: isSuccessUpdateShift,
          // isError: isErrorUpdateShift,
          // error: errorUpdateShift,
        },
    ] = useUpdateAuthorizedUserMutation();

    const onSubmit = async (values: {
        email: string, 
        password: string,
        confirmPassword: string
    },
    formikBag: FormikHelpers<any>
    ) => {
        const {
            email,
            password,
            confirmPassword
        } = values;
        if (password !== confirmPassword) {
            console.log("Passwords don't match");
            return;
        }
        if (dataAuthorizedUsers === undefined) {
            console.log("Authorized Users not loaded.");
            return;
        }
        let ids: EntityId[] = dataAuthorizedUsers.ids;
        let entityDictionary: Dictionary<AuthorizedUser> = dataAuthorizedUsers.entities;
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let authorizedUser = entityDictionary[id];
            if (authorizedUser === undefined) {
                continue;
            }
            console.log(authorizedUser);
            if (authorizedUser.email === email && authorizedUser.accountCreated) {
                console.log("Account already created. Failed to register.");
                return;
            }
            if (authorizedUser.email === email) {
                let dataToChangeAuthorizedUser = {userId: authorizedUser.id, data : {}}
                dataToChangeAuthorizedUser.data = {
                    accountCreated: true
                };
                let result = await updateAuthorizedUser(dataToChangeAuthorizedUser);
                if (!result) {
                    return;
                }
                // TODO: Register account with the auth, using password and the email
                // let dataToRegisterUserAuth = {data: {}}
                // dataToRegisterUserAuth.data = {
                //     email: email,
                //     password: password
                // }
                // result = await registerAuthorizedUser(dataToRegisterUserAuth);
                // if (!result) {
                //     // rollback changes
                //     dataToChangeAuthorizedUser.data = {
                //         accountCreated: false
                //     };
                //     await updateAuthorizedUser(dataToChangeAuthorizedUser);
                // } else {
                //     console.log("success");
                // }
                break;
            }
        }
        console.log("User email not authorized");
    }
    return (
        <Container
            // maxWidth={'lg'}
            sx={{
            height: '100vh',
            backgroundColor: '#f3f5f6',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            }}
        >
            <Box paddingY={5}>
                <Image src={BscLogo} alt="bsc logo" width={150} height={70} />
            </Box>

            <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
                paddingX: 5,
                maxWidth: 600,
            }}
            >
                <Typography component="h1" variant="h5" sx={{ marginTop: 3 }}>
                    Register Account
                </Typography>
                <Formik
                    validationSchema = {RegisterAccountSchema}
                    initialValues = {{
                        email: "",
                        password: "",
                        confirmPassword: ""
                    }}
                    onSubmit = {onSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <TextInput name="email" label="Email" />
                            <TextInput name="password" label="Password" type = "password"/>
                            <TextInput name="confirmPassword" label="Confirm Password" type = "password"/>
                            <Button type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting}
                            >Register Account
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    )
}

export default RegisterAccountForm;