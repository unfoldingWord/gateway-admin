import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, OBS_TW, WAITING, WORKING } from '@common/constants';

export default function useObsTwRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsTwRepoTree, 
    obsTwRepoTreeManifest, 
    obsTwRepoTreeStatus}, 
    setValues
  ] = useState({obsTwRepoTree:null, obsTwRepoTreeManifest:null, obsTwRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsTwRepoTree: null, obsTwRepoTreeManifest: null, obsTwRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tw/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsTwRepoTree: _tree, obsTwRepoTreeManifest: _manifest, obsTwRepoTreeStatus: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      if ( refresh === OBS_TW || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsTwRepoTree,
      obsTwRepoTreeManifest,
      obsTwRepoTreeStatus,
    },
  }
}