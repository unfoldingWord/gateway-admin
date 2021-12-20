import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, SQ, WAITING, WORKING } from '@common/constants';

export default function useSqRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{sqRepoTree, 
    sqRepoTreeManifest, 
    sqManifestSha,
    sqRepoTreeStatus}, 
    setValues
  ] = useState({sqRepoTree:null, sqRepoTreeManifest:null, sqManifestSha:null, sqRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({sqRepoTree: null, sqRepoTreeManifest: null, sqRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_sq/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({sqRepoTree: _tree, sqRepoTreeManifest: _manifest, sqManifestSha: _manifestSha, sqRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      if ( refresh === SQ || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      sqRepoTree,
      sqRepoTreeManifest,
      sqManifestSha,
      sqRepoTreeStatus,
    },
  }
}