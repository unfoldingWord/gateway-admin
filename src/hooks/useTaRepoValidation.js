import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING } from '@common/constants';

export default function useTaRepoValidation({authentication, owner, server, languageId}) {
  const [{taRepoTree, 
    taRepoTreeManifest, 
    taRepoTreeErrorMessage}, 
    setValues
  ] = useState({taRepoTree:null, taRepoTreeManifest:null, taRepoTreeErrorMessage:WORKING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_ta/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({taRepoTree: _tree, taRepoTreeManifest: _manifest, taRepoTreeErrorMessage: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])

  return {
    state: {
      taRepoTree,
      taRepoTreeManifest,
      taRepoTreeErrorMessage,
    },
  }
}