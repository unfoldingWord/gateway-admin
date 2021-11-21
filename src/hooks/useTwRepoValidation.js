import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'

export default function useTwRepoValidation({authentication, owner, server, languageId}) {
  const [{twRepoTree, 
    twRepoTreeManifest, 
    twRepoTreeErrorMessage}, 
    setValues
  ] = useState({twRepoTree:null, twRepoTreeManifest:null, twRepoTreeErrorMessage:"Working..."})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tw/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({twRepoTree: _tree, twRepoTreeManifest: _manifest, twRepoTreeErrorMessage: _errorMesage})
    }
    if (authentication && owner && server && languageId) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])

  return {
    state: {
      twRepoTree,
      twRepoTreeManifest,
      twRepoTreeErrorMessage,
    },
  }
}