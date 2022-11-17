import {
  useContext, useEffect, useState,
} from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
// import CircularProgress from '@material-ui/core/CircularProgress'
import {convertTsv9to7} from '@utils/tsvConversion';

import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { tCCreateBranchesExist, createArchivedTsv9Branch, saveNewTsv7 } from '@utils/dcsApis'
import { doFetch } from '@utils/network'
import { decodeBase64ToUtf8 } from '@utils/decode'
import { TN } from '@common/constants';

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
    state: { 
      tnRepoTree,
    },
    actions: {
      setRefresh,
    }
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
      for ( let i=0; i < tnRepoTree.length; i++) {
        const item = tnRepoTree[i]
        console.log(`Working on ${item.path}`)
        if ( item.path.endsWith('.tsv') ) {
          _convertMessages.push('Working on '+item.path)
          setConvertMessages([..._convertMessages])
          
          // First validate the TSV filename
          const filenameArray = item.path.split('_')
          if ( filenameArray[1] !== 'tn' ) {
            const regex = /^tn_[1-3A-Z]{3}/;
            const found = item.path.match(regex)
            if ( found === null ) {
              _convertMessages.push('... Not a valid TSV9 filename, skipping')
              setConvertMessages([..._convertMessages])
              continue
            } else {
              _convertMessages.push('... File already converted, skipping')
              setConvertMessages([..._convertMessages])
              continue
            }
          }
          const _bookId = filenameArray[2].split('.')[0].substr(-3)
          _convertMessages.push('... is bookdId '+_bookId)
          setConvertMessages([..._convertMessages])
          const content = await doFetch(item.url) 
          console.log("content fetched:", content)
          
          if ( content.status === 1 ) {
            _convertMessages.push('Stopping! '+content.statusText)
            setConvertMessages([..._convertMessages])
            break
          } 
          const _content = decodeBase64ToUtf8(content.data.content)
          const result = convertTsv9to7(_content)
          if ( result.tsv === null ) {
            _convertMessages.push('... Convert failed:'+item.path)
            _convertMessages.push('Problem must be corrected before conversion retried!')
            _convertMessages.push([...result.errors])
            setConvertMessages([..._convertMessages])
            break
          } else {
            //  server, organization, languageId, oldFilename, newFilename, sha, content, tokenid
            const res = await saveNewTsv7({
              server, organization, languageId, 
              oldFilename: item.path,
              newFilename: `tn_${_bookId}.tsv`,
              sha: content.data.sha,
              content: result.tsv,
              tokenid: authentication.token.sha1,
            })
            _convertMessages.push('... Converted:'+item.path)
            setConvertMessages([..._convertMessages])
          }
        }
      }
      setConfirmConvert(false)
      setRefresh(TN)
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
            convertMessages.map((message, i) => <div key={i}><em className='mx-4' key={i}>{message}</em><br/></div>)
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
