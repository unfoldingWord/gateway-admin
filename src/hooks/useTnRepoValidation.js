import { useEffect, useState } from 'react';
import {getTreesManifest} from '@utils/getTreesManifest'
import { WAITING, WORKING } from '@common/constants';

export default function useTnRepoValidation({authentication, owner, server, languageId, refresh}) {
  const [{tnRepoTree, 
    tnRepoTreeManifest, 
    tnRepoTreeErrorMessage}, 
    setValues
  ] = useState({tnRepoTree:null, tnRepoTreeManifest:null, tnRepoTreeErrorMessage:WAITING})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      setValues({tnRepoTree: null, tnRepoTreeManifest: null, tnRepoTreeErrorMessage: WORKING})
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tn/git/trees/master?recursive=false&per_page=999999`
      const {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMesage} =  await getTreesManifest(authentication, url)
      setValues({tnRepoTree: _tree, tnRepoTreeManifest: _manifest, tnRepoTreeErrorMessage: _errorMesage})
    }
    if (authentication && owner && server && languageId && refresh) {
      getReposTrees()
    } else {
      //console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId, refresh])

  return {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeErrorMessage,
    },
  }
}