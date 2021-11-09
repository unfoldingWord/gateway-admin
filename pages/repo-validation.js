import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'

const RepoValidation = dynamic(
  () => import('@components/RepoValidation'),
  {
    ssr: false,
    loading: () => <CircularProgress size={180} />,
  },
)

const Home = () => (
  <div>
    <RepoValidation />
  </div>
)

export default Home
