import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
// import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import PrintSettings from '@components/PrintSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'

const PrintPage = () => {
  const router = useRouter()
  const [confirmPrint, setConfirmPrint] = useState(false)
  const [printDisabled, setPrintDisabled] = useState(true)

  const { state: authentication } = useContext(AuthenticationContext)
  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  const {
    state: {
      printConstraints,
      printResource,
      books,
    },
    actions: {
      setPrintConstraints,
      setPrintResource,
    }
  } = useContext(AdminContext)

  useEffect( () => {
    if (printConstraints === null) {
      setPrintDisabled(true)
    } else if (printConstraints.ot || printConstraints.nt || printConstraints.bpFilter) {
      setPrintDisabled(false)
    } else {
      setPrintDisabled(true)
    }
  },[printConstraints])


  useEffect( () => {

    if ( !confirmPrint ) return;

    async function doPrint() {
      const tokenid = authentication.token.sha1;
      console.log("doPrint() - entered")
      console.log("printConstraints:",printConstraints)
      console.log("printResource", printResource)
    }

    doPrint()

  }, [server, organization, languageId, confirmPrint, printConstraints, printResource])

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Print Repository</h1>
          <PrintSettings />
          <div className='flex justify-end'>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              onClick={() => {
                router.push('/')
              }}
            >
              Close
            </Button>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              disabled={printDisabled}
              onClick={
                () => {
                  setConfirmPrint(true)
                }
              }
            >
              Print Repository
            </Button>
            <br/>
          </div>
          {confirmPrint &&
            <h2 className='mx-4'>Status: {JSON.stringify(books)}</h2>         
          }
        </div>
      </div>
    </Layout>
  )
}

export default PrintPage
