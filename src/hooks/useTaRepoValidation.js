import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, TA, WAITING, WORKING } from '@common/constants';

export default function useTaRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{taRepoTree, 
    taRepoTreeManifest, 
    taManifestSha,
    taRepoTreeStatus}, 
    setValues
  ] = useState({taRepoTree:null, taRepoTreeManifest:null, taManifestSha:null, taRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({taRepoTree: null, taRepoTreeManifest: null, taRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_ta/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({taRepoTree: _tree, taRepoTreeManifest: _manifest, taManifestSha: _manifestSha, taRepoTreeStatus: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      if ( refresh === TA || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      taRepoTree,
      taRepoTreeManifest,
      taManifestSha,
      taRepoTreeStatus,
    },
  }
}