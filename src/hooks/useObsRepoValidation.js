import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING, WAITING, OBS, ALL } from '@common/constants'

export default function useObsRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsRepoTree, 
    obsRepoTreeManifest, 
    obsManifestSha,
    obsRepoTreeStatus}, 
    setValues
  ] = useState({obsRepoTree:null, obsRepoTreeManifest:null, obsManifestSha:null,obsRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_lt/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsRepoTree: null, obsRepoTreeManifest: null, obsRepoTreeStatus: WORKING})
      let _repo = languageId + "_obs"

      const url = `${server}/api/v1/repos/${owner}/${_repo}/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsRepoTree: _tree, obsRepoTreeManifest: _manifest, obsManifestSha: _manifestSha, obsRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      if ( refresh === OBS || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsRepoTree,
      obsRepoTreeManifest,
      obsManifestSha,
      obsRepoTreeStatus,
    },
  }
}