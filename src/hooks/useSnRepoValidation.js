import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, SN, WAITING, WORKING } from '@common/constants';

export default function useSnRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{snRepoTree, 
    snRepoTreeManifest, 
    snManifestSha,
    snRepoTreeStatus}, 
    setValues
  ] = useState({snRepoTree:null, snRepoTreeManifest:null, snManifestSha:null, snRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({snRepoTree: null, snRepoTreeManifest: null, snRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_sn/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({snRepoTree: _tree, snRepoTreeManifest: _manifest, snManifestSha: _manifestSha, snRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      if ( refresh === SN || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      snRepoTree,
      snRepoTreeManifest,
      snManifestSha,
      snRepoTreeStatus,
    },
  }
}