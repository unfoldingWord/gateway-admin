import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import ReleaseSettings from '@components/ReleaseSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { validVersionTag, createRelease } from '@utils/dcsApis'
import { resourceIdMapper } from '@common/ResourceList'

const ReleasePage = () => {
  const router = useRouter()
  const [confirmRelease, setConfirmRelease] = useState(false)
  const [releaseMessage, setReleaseMessage] = useState(<CircularProgress />)
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
      releaseResource,
      releaseVersion,
      releaseNotes,
      releaseName,
      releaseState,
      releaseBooks,
    },
    actions: {
      setReleaseResource,
      setReleaseVersion,
      setReleaseNotes,
      setReleaseName,
      setReleaseState,
      setReleaseBooks,
    }
  } = useContext(AdminContext)

  useEffect( () => {
    if ( releaseResource && releaseVersion && validVersionTag(releaseVersion) ) {
      setReleaseActive(true)
    } else {
      setReleaseActive(false)
    }
  }, [releaseResource, releaseVersion])

  //
  useEffect( () => {

    if ( !confirmRelease ) return;
    if ( !releaseResource ) return;
    if ( !releaseVersion ) return;

    async function doRelease() {
      setReleaseMessage(<CircularProgress />)
      const tokenid = authentication.token.sha1;
      const _resourceId = resourceIdMapper(organization, releaseResource.id)
      const _results = await createRelease({server,
          organization, languageId, resourceId: _resourceId,
          version: releaseVersion,
          notes: releaseNotes,
          name: releaseName,
          state: releaseState,
          tokenid
        })
      setReleaseMessage(<span>{_results.message}</span>)
      // initialize release state vars
      setReleaseResource(null)
      setReleaseVersion(null)
      setReleaseNotes(null)
      setReleaseName(null)
      setReleaseState('prod')
      setReleaseActive(false)
    }

    doRelease()

  }, [server, organization, languageId, releaseResource, releaseVersion, confirmRelease])



  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Release Repository</h1>
          <ReleaseSettings />
          <div className='flex justify-end'>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              onClick={() => {
                setReleaseResource(null)
                setReleaseVersion(null)
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
              Release Repository
            </Button>
            <br/>
          </div>
          {confirmRelease &&
            <h2 className='mx-4'>Status: {releaseMessage}</h2>
          }
        </div>
      </div>
    </Layout>
  )
}

export default ReleasePage
