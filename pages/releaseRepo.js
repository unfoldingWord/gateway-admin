import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import ReleaseRepoSettings from '@components/ReleaseSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'

const ReleasePage = () => {
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
      releaseResource,
      releaseVersion,
    },
  } = useContext(AdminContext)


  useEffect( () => {
    console.log("Repo to Release:",`${organization}/${languageId}_${releaseResource.id}`)
    console.log("Version to release:", releaseVersion)
  }, [organization, languageId, releaseResource, releaseVersion])



  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Release Repository</h1>
          <ReleaseRepoSettings />
          <div className='flex justify-end'>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              onClick={() => router.push('/')}
            >
              Release Repository
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReleasePage
