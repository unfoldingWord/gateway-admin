import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import ReleaseSettings from '@components/ReleaseSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { createRelease, createReleases } from '@utils/dcsApis'
import { resourceIdMapper } from '@common/ResourceList'
import Link from '@material-ui/core/Link'

const ReleasePage = () => {
  const router = useRouter()
  const [confirmRelease, setConfirmRelease] = useState(false)
  const [releaseMessages, setReleaseMessages] = useState([])
  // The release button will be active (enabled) iff all are true:
  // resource is selected, release version supplied and is valid
  const [releaseActive, setReleaseActive] = useState(false)

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
      releaseResources,
      releaseNotes,
      releaseName,
      releaseState,
      releaseBooks,
    },
    actions: {
      setReleaseResources,
      setReleaseNotes,
      setReleaseName,
      setReleaseState,
      setReleaseBooks,
    },
  } = useContext(AdminContext)

  useEffect( () => {
    if ( releaseResources.size > 0 && releaseBooks.size > 0 ) {
      setReleaseActive(true)
    } else {
      setReleaseActive(false)
    }
  }, [releaseResources, releaseBooks])

  //
  useEffect( () => {
    if ( !confirmRelease || releaseResources.size <= 0 || releaseBooks <= 0 ) {
      return
    }

    async function doRelease() {
      const _releaseMessages = Array.from(releaseResources.keys()).map((resourceId, index) => <span key={index}>Releasing {resourceId}<CircularProgress key={resourceId}/></span>)
      setReleaseMessages(_releaseMessages)
      const tokenid = authentication.token.sha1;

      const resourceIds = Array.from(releaseResources.keys()).map((resourceId) => resourceIdMapper(organization, resourceId))

      const books = Array.from(releaseBooks.keys())

      await Promise.allSettled( resourceIds.map( async (resourceId, index) => {
        const result = await createRelease( {
          server,
          organization,
          languageId,
          resourceId,
          books,
          notes: releaseNotes,
          name: releaseName,
          state: releaseState,
          tokenid,
        } )
        console.log(`finished ${index} with ${result.message}`)
        _releaseMessages[index] = <span key={index}>{resourceId} Result {result.message}
          {result.version ?
            <Link target="_blank" href={server + '/' + organization + '/' + languageId + '_' + resourceIdMapper(organization, resourceId)+'/releases/tag/'+result.version}>View {result.version} release</Link>:''
          }
        </span>
        setReleaseMessages(_releaseMessages)
        return result
      } ))

      // initialize release state vars
      setReleaseResources(new Map())
      setReleaseBooks(new Map())
      setReleaseNotes(null)
      setReleaseName(null)
      setReleaseState('prod')
      setReleaseActive(false)
      setConfirmRelease(false)
    }

    doRelease()
  }, [server, organization, languageId, releaseResources, releaseBooks, confirmRelease])

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Release Book Packages</h1>
          <ReleaseSettings />
          <div className='flex justify-end'>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              onClick={() => {
                setReleaseResources(new Map())
                setReleaseBooks(new Map())
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
              disabled={!releaseActive}
              onClick={
                () => {
                  setConfirmRelease(true)
                }
              }
            >
              Release Book Packages
            </Button>
            <br/>
          </div>
          {releaseMessages.map((message, i) => <h2 className='mx-4' key={i}>{message}</h2>)}
        </div>
      </div>
    </Layout>
  )
}

export default ReleasePage
