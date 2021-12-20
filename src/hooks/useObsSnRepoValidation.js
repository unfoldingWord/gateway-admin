import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING, WAITING, OBS_SN, ALL } from '@common/constants';

export default function useObsSnRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsSnRepoTree, 
    obsSnRepoTreeManifest, 
    obsSnManifestSha,
    obsSnRepoTreeStatus}, 
    setValues
  ] = useState({obsSnRepoTree:null, obsSnRepoTreeManifest:null, obsSnManifestSha:null, obsSnRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsSnRepoTree: null, obsSnRepoTreeManifest: null, obsSnRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_obs-sn/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsSnRepoTree: _tree, obsSnRepoTreeManifest: _manifest, obsSnManifestSha: _manifestSha, obsSnRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      if ( refresh === OBS_SN || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsSnRepoTree,
      obsSnRepoTreeManifest,
      obsSnManifestSha,
      obsSnRepoTreeStatus,
    },
  }
}