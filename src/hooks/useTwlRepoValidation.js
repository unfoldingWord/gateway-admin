import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WORKING } from '@common/constants';

export default function useTwlRepoValidation({authentication, owner, server, languageId, refresh, setRefresh}) {
  const [{twlRepoTree, 
    twlRepoTreeManifest, 
    twlRepoTreeErrorMessage}, 
    setValues
  ] = useState({twlRepoTree:null, twlRepoTreeManifest:null, twlRepoTreeErrorMessage:WORKING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_twl/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_twl/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({twlRepoTree: _tree, twlRepoTreeManifest: _manifest, twlRepoTreeErrorMessage: _errorMesage})
    }

    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
      setRefresh(false)
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh, setRefresh])

  return {
    state: {
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeErrorMessage,
    },
  }
}