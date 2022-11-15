import {
  useContext, useEffect, useState,
} from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { tCCreateBranchesExist, createArchivedTsv9Branch } from '@utils/dcsApis'
import { async } from 'regenerator-runtime'
// import { createRelease } from '@utils/dcsApis'
// import Link from '@material-ui/core/Link'

const ConvertPage = () => {
  const router = useRouter()
  const [convertMessages, setConvertMessages] = useState([])
  const [disableConvert, setDisableConvert] = useState(true)
  const [confirmConvert, setConfirmConvert] = useState(false)

  const { state: authentication } = useContext(AuthenticationContext)
  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  const {
    state: { tnRepoTree },
    actions,
  } = useContext(AdminContext)

  // archive the existing branch for posterity
  // then start converting
  useEffect( () => {
    async function archiveBranch () {
      setDisableConvert(true)
      let _convertMessages = []
      const archiveResults = await createArchivedTsv9Branch({
        server, organization, languageId, tokenid:authentication.token.sha1,
      })
      if ( archiveResults.status === 201 ) {
        _convertMessages.push('Archive of master branch successful.')
        setConvertMessages([..._convertMessages])
      } else {
        _convertMessages.push('Archived failed, status='+archiveResults.status)
        setConvertMessages([..._convertMessages])
        return
      }
      _convertMessages.push('Begin converting files...')
      setConvertMessages([..._convertMessages])
      console.log("tnrepo:", tnRepoTree)

    }
    if ( confirmConvert ) {
      archiveBranch()
    }
  },[confirmConvert])

  // check for non-merged user branches from tc-create
  useEffect( () => {
    async function checkForTcCreateBranches() {
      let _convertMessages = []
      _convertMessages.push('Checking for tC Create user branches...')
      setConvertMessages([..._convertMessages])
      const anyTcCreateBranches = await tCCreateBranchesExist({
        server, organization, languageId, tokenid:authentication.token.sha1,
      })

      if ( anyTcCreateBranches ) {
        _convertMessages.push('There are tC Create user branches - cannot continue')
        setConvertMessages([..._convertMessages])
        setDisableConvert(true)
        return
      }

      _convertMessages.push('There are no tC Create user branches, click Convert button to continue')
      setConvertMessages([..._convertMessages])
      setDisableConvert(false)
    }

    if ( authentication?.token && server && organization && languageId ) {
      checkForTcCreateBranches()
    }
  }, [authentication, server, organization, languageId])

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Convert TSV9 to TSV7 Format</h1>
          <div>
            <ul>
              <li>User starts the conversion process.</li>
              <li>Check for tCCreate branches, if they exist, do not continue.(All user branches need to be merged to master branch and deleted after)</li>
              <li>Archive existing master(TSV 9 ) file.</li>
              <li>Run conversion</li>
              <li>Update the manifest</li>
              <li>Inform user " File format has been updated. The old files are archived at ..."</li>
            </ul>
          </div>
          {
            convertMessages.map((message, i) => <h2 className='mx-4' key={i}>{message}</h2>)
          }
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
              disabled={disableConvert}
              onClick={
                () => {
                  setConfirmConvert(true)
                }
              }
            >
              Convert
            </Button>
            <br/>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ConvertPage
