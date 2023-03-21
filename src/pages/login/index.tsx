import * as React from 'react'
import { useEffect } from 'react'
import Image from 'next/image'
import BscLogo from '../../assets/bsclogo.png'

//** Materials UI Components*/
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'
// import { useTheme } from '@mui/material/styles'
import './Login.module.css'

//** React-Redux */
import { useDispatch, useSelector } from 'react-redux'
import {
    setCredentials,
    // setUserRoles,
    // setCurrentRole,
    setCurrentUser,
    logOut,
    setCurrentHouse,
    selectCurrentUser,
} from '../../features/auth/authSlice'

//** Api's */
import { useLoginMutation } from '@/features/auth/authApiSlice'

//** Hooks */
import { useState } from 'react'
// import usePersist from '../../hooks/usePersist'
// import useGoToRoute from '../../hooks/useGoToRoute'

//** Formik and Yup for Custom forms */
import { Formik, Form, Field, FormikHelpers } from 'formik'
import * as Yup from 'yup'

//** Custom Components */
import { TextInput } from '../../components/shared/forms/CustomFormikFields'
import Copyright from '../../components/shared/Copyright'
import firebase, { FirebaseApp, FirebaseError } from 'firebase/app'
import { useRouter } from 'next/router'

//** LogIn Schema */
const LoginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
})

//** Log in Component */
export default function Login() {
    /** Materials UI component styles */
    //! is not use as of right now. Need to implement
    // const theme = useTheme()

    /** Hook to persist the application state in browser */
    // const [persist, setPersist] = usePersist(true)
    /** Holds the errro messge response from backend */
    const [errMsg, setErrMsg] = useState('')
    /** sets the error state of the helperText logIn message to true */
    const [error, setError] = useState(true)

    const authUser = useSelector(selectCurrentUser)

    /** uses useNavigate from react-dom but verifies path */
    // const nav = useGoToRoute()
    /** Hooks to dispatch action for redux state */
    const dispatch = useDispatch()

    const router = useRouter()
    /** Sets weather to persist or not the state of the application */
    // const handleToggle = () => setPersist((prev) => !prev)

    /** LogIn Api */
    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        if (authUser) {
            router.push('/account')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser])

    //TODO: Delete after testing ******************************
    // useEffect(() => {
    //     console.log('Mounting Loging')
    //     return () => {
    //         console.log('Unmounting Logging')
    //     }
    // }, [])
    //TODO: Delete after testing ********************************

    /** Handle the submit of the login form */
    const handleSubmit = async (
        values: {
            email: string
            password: string
        },
        formikBag: FormikHelpers<any>
    ) => {
        // Get password and email from the form
        const { email, password } = values
        try {
            // Destruct return value from server response
            await login({
                email,
                password,
            }).unwrap()

            // Reset form and enable submint button
            formikBag.setSubmitting(false)
            formikBag.resetForm()

            // Navigate to privatre accout
            router.push('/account')
        } catch (error) {
            setError(true)
            console.log(error)
            const err: FirebaseError = error as FirebaseError
            // if (err instanceof FirebaseError) {
            console.log('Firebase error:', err.code, err.message)
            if (!err.code) {
                setErrMsg('No Server Response')
            } else if (err.code === '400') {
                setErrMsg('Missing Email or Password')
            } else if (err.code === 'auth/user-not-found') {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg(err.message)
            }
        }
    }

    let content = null
    if (isLoading) {
        //Todo: Create a Loading page
        content = <div>Loading...</div>
    } else {
        content = (
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
                    <Image src={BscLogo} alt='bsc logo' width={150} height={70} />
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
                    <Typography component='h1' variant='h5' sx={{ marginTop: 3 }}>
                        Sign in
                    </Typography>
                    <Formik
                        sx={{ mt: 1 }}
                        validationSchema={LoginSchema}
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Box component={Form}>
                                <FormHelperText error={error}>{errMsg}</FormHelperText>
                                <TextInput name='email' label='Email' type='email' />
                                <TextInput name='password' label='Password' type='password' />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value='remember'
                                            color='primary'
                                            onChange={() => console.log('remember')}
                                            checked={true}
                                        />
                                    }
                                    label='Remember me'
                                />
                                <Button
                                    type='submit'
                                    fullWidth
                                    variant='contained'
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={isSubmitting}
                                >
                                    Sign In
                                </Button>
                                <Grid container sx={{ marginBottom: 3 }}>
                                    <Grid item xs>
                                        <Link href='/' variant='body2'>
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href='#' variant='body2'>
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Formik>
                </Card>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        )
    }
    return content
}
