import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, TN, WAITING, WORKING } from '@common/constants';

export default function useTnRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{tnRepoTree, 
    tnRepoTreeManifest, 
    tnRepoTreeStatus}, 
    setValues
  ] = useState({tnRepoTree:null, tnRepoTreeManifest:null, tnRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({tnRepoTree: null, tnRepoTreeManifest: null, tnRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tn/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({tnRepoTree: _tree, tnRepoTreeManifest: _manifest, tnRepoTreeStatus: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      if ( refresh === TN || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeStatus,
    },
  }
}