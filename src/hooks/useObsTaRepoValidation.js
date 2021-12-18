import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WAITING, WORKING } from '@common/constants';

export default function useObsTaRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsTaRepoTree, 
    obsTaRepoTreeManifest, 
    obsTaRepoTreeErrorMessage}, 
    setValues
  ] = useState({obsTaRepoTree:null, obsTaRepoTreeManifest:null, obsTaRepoTreeErrorMessage:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsTaRepoTree: null, obsTaRepoTreeManifest: null, obsTaRepoTreeErrorMessage: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_ta/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsTaRepoTree: _tree, obsTaRepoTreeManifest: _manifest, obsTaRepoTreeErrorMessage: _errorMesage})
    }
    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsTaRepoTree,
      obsTaRepoTreeManifest,
      obsTaRepoTreeErrorMessage,
    },
  }
}