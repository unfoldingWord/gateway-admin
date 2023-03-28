import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import ReleaseSettings from '@components/ReleaseSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { resourceIdMapper } from '@common/ResourceList'
import { ALL, OBS_SN, SN, SQ, TN, TQ, TWL, LT, ST, OBS, OBS_SQ, OBS_TW, OBS_TWL, OBS_TA, OBS_TN, OBS_TQ, TW, TA } from "@common/constants";

const BranchMerge = () => {
  const router = useRouter()

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

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>No Conflict Merge Management</h1>
          <p>here is where a resource list goes</p>
          <p>here is where a branch picker goes</p>
          <div className='flex justify-end'>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
            >
              Update user branch with new stuff from Master
            </Button>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
            //   disabled={!releaseActive}
            >
              Merge user branch into Master!
            </Button>
            <br/>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BranchMerge
