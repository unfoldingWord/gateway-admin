import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WAITING, WORKING } from '@common/constants';

export default function useObsTwlRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsTwlRepoTree, 
    obsTwlRepoTreeManifest, 
    obsTwlRepoTreeStatus}, 
    setValues
  ] = useState({obsTwlRepoTree:null, obsTwlRepoTreeManifest:null, obsTwlRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_twl/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsTwlRepoTree: null, obsTwlRepoTreeManifest: null, obsTwlRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_obs-twl/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsTwlRepoTree: _tree, obsTwlRepoTreeManifest: _manifest, obsTwlRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsTwlRepoTree,
      obsTwlRepoTreeManifest,
      obsTwlRepoTreeStatus,
    },
  }
}