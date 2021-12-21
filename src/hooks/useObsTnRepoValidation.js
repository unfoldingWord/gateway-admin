import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, OBS_TN, WAITING, WORKING } from '@common/constants';

export default function useObsTnRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsTnRepoTree, 
    obsTnRepoTreeManifest, 
    obsTnManifestSha,
    obsTnRepoTreeStatus}, 
    setValues
  ] = useState({obsTnRepoTree:null, obsTnRepoTreeManifest:null, obsTnManifestSha:null, obsTnRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsTnRepoTree: null, obsTnRepoTreeManifest: null, obsTnRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_obs-tn/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsTnRepoTree: _tree, obsTnRepoTreeManifest: _manifest, obsTnManifestSha: _manifestSha, obsTnRepoTreeStatus: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      if ( refresh === OBS_TN || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsTnRepoTree,
      obsTnRepoTreeManifest,
      obsTnManifestSha,
      obsTnRepoTreeStatus,
    },
  }
}