import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'

export default function useTqRepoValidation({authentication, owner, server, languageId}) {
  const [{tqRepoTree, 
    tqRepoTreeManifest, 
    tqRepoTreeErrorMessage}, 
    setValues
  ] = useState({tqRepoTree:null, tqRepoTreeManifest:null, tqRepoTreeErrorMessage:null})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tq/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({tqRepoTree: _tree, tqRepoTreeManifest: _manifest, tqRepoTreeErrorMessage: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      getReposTrees()
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])

  return {
    state: {
      tqRepoTree,
      tqRepoTreeManifest,
      tqRepoTreeErrorMessage,
    },
  }
}