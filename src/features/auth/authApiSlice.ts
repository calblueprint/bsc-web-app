import { apiSlice } from '../../store/api/apiSlice'
import { firestore, auth } from '../../firebase/clientApp'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { User, House } from '../../types/schema'
import { setCredentials, logOut } from './authSlice'
import { FirebaseError } from 'firebase/app'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      async queryFn({ email, password }) {
        try {
          // firebase signIn function with email and passoword
          const userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
          )
          // console.log(userCredentials)

          if (!userCredentials) {
            throw { error: userCredentials }
          }
          return await establishUserContext(userCredentials.user.uid)
        } catch (error) {
          console.log('Error Logging In: ', error)
          if (error instanceof FirebaseError) {
            console.log('Firebase error:', error.code, error.message)
            // throw new FirebaseError(error.code, error.message)
            return { error: { code: error.code, message: error.message } }
          } else {
            console.log('Unknown error:', error)
            // throw new FirebaseError("Code 400", "Unknown error:")
            return { error: 'Unknown error' }
          }
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled
          // console.log('Query Fulfilled: ', result)
          if (!result.data) {
            console.log('User and House object are empty')
            return
          }
          const { user, house } = result.data
          dispatch(setCredentials({ user, house }))
          // return { data: arg }
        } catch (error) {
          console.log('Error: ', error)
        }
      },
    }),

    authLogOut: builder.mutation({
      async queryFn() {
        try {
          const result = await signOut(auth)
          // console.log('logout result: ' + result)
          return { data: 'Logged Out' }
        } catch (error) {
          return { error }
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(logOut())
          dispatch(apiSlice.util.resetApiState())
        } catch (error) {
          console.log(error)
        }
      },
    }),

    establishContext: builder.mutation({
      async queryFn(userId: string) {
        return await establishUserContext(userId)
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled
          // console.log('[Refreshed]: Query Fulfilled: ', result)
          if (!result.data) {
            console.log('User and House object are empty')
            return
          }
          const { user, house } = result.data
          // console.log(
          //   '[Refreshed]: Query Fulfilled:  --user: ',
          //   user,
          //   '  --house: ',
          //   house
          // )
          dispatch(setCredentials({ user, house }))
          // return { data: arg }
        } catch (error) {
          console.log(error)
        }
      },
    }),
  }),
})

const establishUserContext = async (userId: string) => {
  try {
    if (!userId) {
      return { error: 'Wrong credentials' }
    }
    // console.log('Establishing Context with: ', userId)
    const userID = userId
    const docRef = doc(firestore, 'users', userID)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return { error: 'No user with those credentials in the database' }
    }
    const user = docSnap.data() as User
    user.id = docSnap.id.toString()
    if (!user.id) {
      return { error: 'User does not have attribute --id-' }
    }
    const houseDocRef = doc(firestore, 'houses', user.houseID)
    const houseSnap = await getDoc(houseDocRef)

    if (!houseSnap.exists()) {
      return { error: 'User not assigned to a valid house.' }
    }
    const house = { ...(houseSnap.data() as House), id: houseSnap.id }

    return { data: { user, house } }
  } catch (error) {
    return { error }
  }
}

export const {
  useLoginMutation,
  useAuthLogOutMutation,
  useEstablishContextMutation,
} = authApiSlice
