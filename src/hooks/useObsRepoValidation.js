import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING, WAITING } from '@common/constants'

export default function useObsRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsRepoTree, 
    obsRepoTreeManifest, 
    obsRepoTreeStatus}, 
    setValues
  ] = useState({obsRepoTree:null, obsRepoTreeManifest:null, obsRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_lt/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsRepoTree: null, obsRepoTreeManifest: null, obsRepoTreeStatus: WORKING})
      let _repo = languageId + "_obs"

      const url = `${server}/api/v1/repos/${owner}/${_repo}/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsRepoTree: _tree, obsRepoTreeManifest: _manifest, obsRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsRepoTree,
      obsRepoTreeManifest,
      obsRepoTreeStatus,
    },
  }
}