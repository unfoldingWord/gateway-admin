import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import ReleaseSettings from '@components/ReleaseSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { createRelease } from '@utils/dcsApis'
import { resourceIdMapper } from '@common/ResourceList'
import Link from '@material-ui/core/Link'
import { ALL, OBS_SN, SN, SQ, TN, TQ, TWL, LT, ST, OBS, OBS_SQ, OBS_TW, OBS_TWL, OBS_TA, OBS_TN, OBS_TQ, TW, TA } from "@common/constants";

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
      obsRepoTree,
      obsTnRepoTree,
      obsTwlRepoTree,
      obsTqRepoTree,
      obsTaRepoTree,
      obsTwRepoTree,
      obsSnRepoTree,
      obsSqRepoTree,
      tnRepoTree,
      twlRepoTree,
      ltRepoTree,
      stRepoTree,
      tqRepoTree,
      sqRepoTree,
      snRepoTree,
      taRepoTree,
      twRepoTree,
    },
    actions: {
      setReleaseResources,
      setReleaseNotes,
      setReleaseName,
      setReleaseState,
      setReleaseBooks,
      setRefresh,
    },
  } = useContext(AdminContext)

  const getResourceTree = (resourceId) => {
    switch ( resourceId ) {
    case TN:
      return tnRepoTree
    case TW:
      return twRepoTree
    case TA:
      return taRepoTree
    case SN:
      return snRepoTree
    case SQ:
      return sqRepoTree
    case TQ:
      return tqRepoTree
    case 'ust':
    case 'gst':
    case ST:
      return stRepoTree
    case 'ult':
    case 'glt':
    case LT:
      return ltRepoTree
    case TWL:
      return twlRepoTree
    case OBS:
      return obsRepoTree
    case OBS_SN:
      return obsSnRepoTree
    case OBS_SQ:
      return obsSqRepoTree
    case OBS_TW:
      return obsTwRepoTree
    case OBS_TA:
      return obsTaRepoTree
    case OBS_TN:
      return obsTnRepoTree
    case OBS_TWL:
      return obsTwlRepoTree
    case OBS_TQ:
      return obsTqRepoTree
    default:
      throw new Error(`no such resource ${resourceId}`)
    }
  }

  useEffect( () => {
    if ( releaseResources.size > 0 && releaseBooks.size > 0 && releaseName && releaseName.length > 0 && releaseNotes && releaseNotes.length > 0 ) {
      setReleaseActive(true)
    } else {
      setReleaseActive(false)
    }
  }, [releaseResources, releaseBooks, releaseName, releaseNotes])

  //
  useEffect( () => {
    if ( !confirmRelease || releaseResources.size <= 0 || releaseBooks <= 0 ) {
      return
    }

    async function doRelease() {
      const tokenid = authentication.token.sha1

      const resourceIds = Array.from(releaseResources.keys()).map((resourceId) => resourceIdMapper(organization, resourceId))

      const books = Array.from(releaseBooks.keys())
      let realResourceIds = []

      if ( books.includes('obs') ) {
        resourceIds.forEach( (resourceId, index) => {
          if ( ['tn','tq','twl', 'sn', 'sq'].includes(resourceId) ) {
            realResourceIds.push('obs-'+resourceId)

            if ( books.length > 1) {
              realResourceIds.push(resourceId)
            }
          } else if ( 'obs' === resourceId ) {
            realResourceIds.push(resourceId)
          }
        })
        books.splice(books.indexOf('obs'),1)
      } else {
        realResourceIds = resourceIds
      }

      const _releaseMessages = realResourceIds.map((resourceId, index) => <span key={index}>Releasing {resourceId}<CircularProgress key={resourceId}/></span>)
      setReleaseMessages(_releaseMessages)

      console.log('releasing .........')
      console.log(realResourceIds)
      console.log(books)

      const statuses = await Promise.allSettled( realResourceIds.map( async (resourceId, index) => {
        const resourceTree = getResourceTree( resourceId )

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
          resourceTree,
        } )

        console.log( `finished ${ index } with ${ result.message }` )
        _releaseMessages[ index ] = <span key={ index }>{ resourceId } Result { result.message }
          { result.version ?
            <Link target="_blank"
              href={ server + '/' + organization + '/' + languageId + '_' + resourceIdMapper( organization, resourceId ) + '/releases/tag/' + result.version }> View { result.version } release</Link> : ''
          }
        </span>
        setReleaseMessages( _releaseMessages )
        return result
      } ))

      console.log(statuses)

      // initialize release state vars
      setReleaseResources(new Map())
      setReleaseBooks(new Map())
      setReleaseNotes('')
      setReleaseName('')
      setReleaseState('prod')
      setReleaseActive(false)
      setConfirmRelease(false)
      setRefresh(ALL)
    }

    doRelease()
  }, [server, organization, languageId, releaseResources, releaseBooks, confirmRelease])

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Release Resources</h1>
          <ReleaseSettings />
          <Paper className='flex flex-col h-90 w-full p-6 pt-3 my-2'>
            {releaseMessages.map((message, i) => <h2 className='mx-4' key={i}>{message}</h2>)}
          </Paper>
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
              Release Resources
            </Button>
            <br/>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReleasePage
