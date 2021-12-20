import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING, WAITING, TW, ALL } from '@common/constants';

export default function useTwRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{twRepoTree, 
    twRepoTreeManifest, 
    twRepoTreeStatus}, 
    setValues
  ] = useState({twRepoTree:null, twRepoTreeManifest:null, twRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({twRepoTree: _tree, twRepoTreeManifest: _manifest, twRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tw/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({twRepoTree: _tree, twRepoTreeManifest: _manifest, twRepoTreeStatus: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      if ( refresh === TW || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      twRepoTree,
      twRepoTreeManifest,
      twRepoTreeStatus,
    },
  }
}