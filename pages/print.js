import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import PrintIcon from '@material-ui/icons/Save'
import dynamic from 'next/dynamic'
import CircularProgress from '@components/CircularProgress'
import Layout from '@components/Layout'

const PreviewContent = dynamic(
  () => import('@components/PreviewContent'),
  {
    ssr: false,
    loading: () => <CircularProgress size={180} />,
  },
)

const PrintPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Print Preview</h1>
          <PreviewContent />
          <div id="preview">Test</div>
          <div className='flex justify-end'>
            <Button
              size='large'
              color='primary'
              className='my-3'
              variant='contained'
              onClick={() => router.push('/')}
              startIcon={<PrintIcon />}
            >
              Print
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PrintPage
