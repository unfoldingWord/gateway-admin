import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, WAITING, WORKING, OBS_TA } from '@common/constants';

export default function useObsTaRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsTaRepoTree, 
    obsTaRepoTreeManifest, 
    obsTaManifestSha,
    obsTaRepoTreeStatus}, 
    setValues
  ] = useState({obsTaRepoTree:null, obsTaRepoTreeManifest:null, obsTaManifestSha:null, obsTaRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsTaRepoTree: null, obsTaRepoTreeManifest: null, obsTaRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_ta/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      console.log("obsTa stuff:", _errorMesage)
      setValues({obsTaRepoTree: _tree, obsTaRepoTreeManifest: _manifest, obsTaManifestSha: _manifestSha, obsTaRepoTreeStatus: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      if ( refresh === OBS_TA || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsTaRepoTree,
      obsTaRepoTreeManifest,
      obsTaManifestSha,
      obsTaRepoTreeStatus,
    },
  }
}