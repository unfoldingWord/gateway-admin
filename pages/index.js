import Head from 'next/head'
import styles from '../src/styles/Home.module.css'
import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'
import Layout from '@components/Layout'

const RepoValidation = dynamic(
  () => import('@components/RepoValidation'),
  {
    ssr: false,
    loading: () => <CircularProgress size={180} />,
  },
)

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>gatewayAdmin</title>
          <meta name="description" content="gatewayAdmin" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <RepoValidation />
      </div>
    </Layout>
  )
}
