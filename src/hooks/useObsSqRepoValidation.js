import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, OBS_SQ, WAITING, WORKING } from '@common/constants';

export default function useObsSqRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsSqRepoTree, 
    obsSqRepoTreeManifest, 
    obsSqRepoTreeStatus}, 
    setValues
  ] = useState({obsSqRepoTree:null, obsSqRepoTreeManifest:null, obsSqRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsSqRepoTree: null, obsSqRepoTreeManifest: null, obsSqRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_obs-sq/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsSqRepoTree: _tree, obsSqRepoTreeManifest: _manifest, obsSqRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      if ( refresh === OBS_SQ || refresh === ALL ) {

      }
      getReposTrees()
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsSqRepoTree,
      obsSqRepoTreeManifest,
      obsSqRepoTreeStatus,
    },
  }
}