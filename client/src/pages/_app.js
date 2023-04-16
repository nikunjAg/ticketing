import { ThemeProvider } from '@mui/material'

import { CacheProvider } from '@emotion/react'
import { createEmotionCache } from '@/utils'
import { SessionProvider } from 'next-auth/react'

import Layout from '@/components/Layout/Layout'
import '@/styles/globals.css'
import { theme } from '@/theme/theme'

const clientSideEmotionCache = createEmotionCache();

export default function App({ Component, pageProps, emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache} >
      <ThemeProvider theme={theme} >
        <SessionProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
