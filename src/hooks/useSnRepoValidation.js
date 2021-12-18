import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WAITING, WORKING } from '@common/constants';

export default function useSnRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{snRepoTree, 
    snRepoTreeManifest, 
    snRepoTreeErrorMessage}, 
    setValues
  ] = useState({snRepoTree:null, snRepoTreeManifest:null, snRepoTreeErrorMessage:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({snRepoTree: null, snRepoTreeManifest: null, snRepoTreeErrorMessage: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_sn/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({snRepoTree: _tree, snRepoTreeManifest: _manifest, snRepoTreeErrorMessage: _errorMesage})
    }

    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      snRepoTree,
      snRepoTreeManifest,
      snRepoTreeErrorMessage,
    },
  }
}