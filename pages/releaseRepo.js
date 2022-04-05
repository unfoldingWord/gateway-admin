import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import ReleaseSettings from '@components/ReleaseSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { validVersionTag } from '@utils/dcsApis'

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
    },
    actions: {
      setReleaseResource,
      setReleaseVersion,
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

    setReleaseMessage(<CircularProgress />)

    console.log("Repo to Release:",`${organization}/${languageId}_${releaseResource.id}`)
    console.log("Version to release:", releaseVersion)

    setTimeout( () => {
      setReleaseMessage(<>Success!</>)
      // initialize release state vars
      setReleaseResource(null)
      setReleaseVersion(null)
      setReleaseActive(false)
      // setConfirmRelease(false)
    }, 5000)
  }, [organization, languageId, releaseResource, releaseVersion, confirmRelease])



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
            <h1 className='mx-4'>Status: {releaseMessage}</h1>         
          }
        </div>
      </div>
    </Layout>
  )
}

export default ReleasePage
