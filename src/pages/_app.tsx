// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthState } from '@/features/auth/AuthState'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import theme from '../assets/Theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthState>
          <Component {...pageProps} />
        </AuthState>
      </ThemeProvider>
    </Provider>
  )
}
