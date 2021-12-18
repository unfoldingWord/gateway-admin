import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WAITING, WORKING } from '@common/constants';

export default function useObsTwRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsTwRepoTree, 
    obsTwRepoTreeManifest, 
    obsTwRepoTreeErrorMessage}, 
    setValues
  ] = useState({obsTwRepoTree:null, obsTwRepoTreeManifest:null, obsTwRepoTreeErrorMessage:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsTwRepoTree: null, obsTwRepoTreeManifest: null, obsTwRepoTreeErrorMessage: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tw/git/trees/master?recursive=true&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsTwRepoTree: _tree, obsTwRepoTreeManifest: _manifest, obsTwRepoTreeErrorMessage: _errorMesage})
    }
    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsTwRepoTree,
      obsTwRepoTreeManifest,
      obsTwRepoTreeErrorMessage,
    },
  }
}