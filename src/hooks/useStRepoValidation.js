import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WAITING, WORKING } from '@common/constants';

export default function useStRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{stRepoTree, 
    stRepoTreeManifest, 
    stRepoTreeStatus}, 
    setValues
  ] = useState({stRepoTree:null, stRepoTreeManifest:null, stRepoTreeStatus:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_st/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({stRepoTree: null, stRepoTreeManifest: null, stRepoTreeStatus: WORKING})
      let _repo = languageId
      if ( owner === "unfoldingWord" || owner === "unfoldingword" ) {
        _repo += "_ust"
      } else {
        _repo += "_gst"
      }
      const url = `${server}/api/v1/repos/${owner}/${_repo}/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeStatus: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({stRepoTree: _tree, stRepoTreeManifest: _manifest, stRepoTreeStatus: _errorMesage})
    }

    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      stRepoTree,
      stRepoTreeManifest,
      stRepoTreeStatus,
    },
  }
}