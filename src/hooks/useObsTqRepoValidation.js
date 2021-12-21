import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { ALL, WAITING, WORKING, OBS_TQ } from '@common/constants';

export default function useObsTqRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{obsTqRepoTree, 
    obsTqRepoTreeManifest, 
    obsTqManifestSha,
    obsTqRepoTreeStatus}, 
    setValues
  ] = useState({obsTqRepoTree:null, obsTqRepoTreeManifest:null, obsTqManifestSha:null, obsTqRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({obsTqRepoTree: null, obsTqRepoTreeManifest: null, obsTqRepoTreeStatus: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_obs-tq/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({obsTqRepoTree: _tree, obsTqRepoTreeManifest: _manifest, obsTqManifestSha: _manifestSha, obsTqRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId) {
      if ( refresh === OBS_TQ || refresh === ALL ) {
        getReposTrees()
      }
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      obsTqRepoTree,
      obsTqRepoTreeManifest,
      obsTqManifestSha,
      obsTqRepoTreeStatus,
    },
  }
}