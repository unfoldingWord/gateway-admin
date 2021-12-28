import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, WORKING, WAITING, LT } from '@common/constants'

export default function useLtRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{ltRepoTree, 
    ltRepoTreeManifest, 
    ltManifestSha,
    ltRepoTreeStatus}, 
    setValues
  ] = useState({ltRepoTree:null, ltRepoTreeManifest:null, ltManifestSha:null, ltRepoTreeStatus:WAITING})

  console.log("useLtRepoValidation(), refresh=",refresh)
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
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({ltRepoTree: _tree, ltRepoTreeManifest: _manifest, ltManifestSha: _manifestSha, ltRepoTreeStatus: _errorMesage})
    }
    console.log("useLtRepoValidation()/useEffect(), refresh=",refresh)

    if (authentication && owner && server && languageId) {
      console.log("useLtRepoValidation() refresh value:",refresh)
      if ( refresh === LT || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      ltRepoTree,
      ltRepoTreeManifest,
      ltManifestSha,
      ltRepoTreeStatus,
    },
  }
}