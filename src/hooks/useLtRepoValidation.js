import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING, WAITING } from '@common/constants'

export default function useLtRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{ltRepoTree, 
    ltRepoTreeManifest, 
    ltRepoTreeStatus}, 
    setValues
  ] = useState({ltRepoTree:null, ltRepoTreeManifest:null, ltRepoTreeStatus:WORKING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_lt/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({ltRepoTree: null, ltRepoTreeManifest: null, ltRepoTreeStatus: WORKING})
      let _repo = languageId
      if ( owner === "unfoldingWord" || owner === "unfoldingword" ) {
        _repo += "_ult"
      } else {
        _repo += "_glt"
      }
      const url = `${server}/api/v1/repos/${owner}/${_repo}/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({ltRepoTree: _tree, ltRepoTreeManifest: _manifest, ltRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      ltRepoTree,
      ltRepoTreeManifest,
      ltRepoTreeStatus,
    },
  }
}