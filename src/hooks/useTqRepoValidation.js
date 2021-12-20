import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, TQ, WAITING, WORKING } from '@common/constants';

export default function useTqRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{tqRepoTree, 
    tqRepoTreeManifest, 
    tqManifestSha,
    tqRepoTreeStatus}, 
    setValues
  ] = useState({tqRepoTree:null, tqRepoTreeManifest:null, tqManifestSha:null, tqRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({tqRepoTree: null, tqRepoTreeManifest: null, tqRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tq/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({tqRepoTree: _tree, tqRepoTreeManifest: _manifest, tqManifestSha: _manifestSha, tqRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      if ( refresh === TQ || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      tqRepoTree,
      tqRepoTreeManifest,
      tqManifestSha,
      tqRepoTreeStatus,
    },
  }
}