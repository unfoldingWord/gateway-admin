import Head from 'next/head'
import styles from '../src/styles/Home.module.css'
import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'

const RepoValidation = dynamic(
  () => import('@components/RepoValidation'),
  {
    ssr: false,
    loading: () => <CircularProgress size={180} />,
  },
)

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>unfoldingWord Nextjs Template App</title>
        <meta name="description" content="unfoldingWord Nextjs template app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RepoValidation />
    </div>
  )
}
