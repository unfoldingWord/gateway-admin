import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING, WAITING } from '@common/constants';

export default function useTwlRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{twlRepoTree, 
    twlRepoTreeManifest, 
    twlRepoTreeStatus}, 
    setValues
  ] = useState({twlRepoTree:null, twlRepoTreeManifest:null, twlRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_twl/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({twlRepoTree: null, twlRepoTreeManifest: null, twlRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_twl/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({twlRepoTree: _tree, twlRepoTreeManifest: _manifest, twlRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeStatus,
    },
  }
}