import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'

export default function useLtRepoValidation({authentication, owner, server, languageId}) {
  const [{ltRepoTree, 
    ltRepoTreeManifest, 
    ltRepoTreeErrorMessage}, 
    setValues
  ] = useState({ltRepoTree:null, ltRepoTreeManifest:null, ltRepoTreeErrorMessage:null})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_lt/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      let _repo = languageId
      if ( owner === "unfoldingWord" || owner === "unfoldingword" ) {
        _repo += "_ult"
      } else {
        _repo += "_glt"
      }
      const url = `${server}/api/v1/repos/${owner}/${_repo}/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({ltRepoTree: _tree, ltRepoTreeManifest: _manifest, ltRepoTreeErrorMessage: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      getReposTrees()
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])

  return {
    state: {
      ltRepoTree,
      ltRepoTreeManifest,
      ltRepoTreeErrorMessage,
    },
  }
}