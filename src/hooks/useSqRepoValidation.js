import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'

export default function useSqRepoValidation({authentication, owner, server, languageId}) {
  const [{sqRepoTree, 
    sqRepoTreeManifest, 
    sqRepoTreeErrorMessage}, 
    setValues
  ] = useState({sqRepoTree:null, sqRepoTreeManifest:null, sqRepoTreeErrorMessage:null})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_sq/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({sqRepoTree: _tree, sqRepoTreeManifest: _manifest, sqRepoTreeErrorMessage: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      getReposTrees()
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])

  return {
    state: {
      sqRepoTree,
      sqRepoTreeManifest,
      sqRepoTreeErrorMessage,
    },
  }
}