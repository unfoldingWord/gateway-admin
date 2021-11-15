import { useEffect, useState } from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';
import YAML from 'js-yaml-parser'
import {
  HTTP_GET_MAX_WAIT_TIME,
} from '@common/constants'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import {decodeBase64ToUtf8} from '@utils/decode'


export default function useTnRepoValidation({authentication, owner, server, languageId}) {
/*
  const [tnRepoTree, setTnRepoTree] = useState({})
  const [tnRepoTreeManifest, setTnRepoTreeManifest] = useState({})
  const [tnRepoTreeErrorMessage, setTnRepoTreeErrorMessage] = useState(null)
*/
  const [{tnRepoTree, 
    tnRepoTreeManifest, 
    tnRepoTreeErrorMessage}, 
    setValues
  ] = useState({tnRepoTree:null, tnRepoTreeManifest:null, tnRepoTreeErrorMessage:null})
  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tn/git/trees/master?recursive=false&per_page=999999`
      let errorCode = 0
      let _tree = null
      let _manifest = null
      let _errorMessage = null
      try {
        const trees = await doFetch(url,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
              return null
            }
            return response?.data
        })

        if (trees === null) { // if no repo
          console.warn(`AdminContext - empty repo`)
          //setTnRepoTreeErrorMessage("Repo Not Found")
          //setValues({tnRepoTreeErrorMessage: "Repo not found"})
          _errorMessage = "Repo not found"
        } if ( trees.tree ) {
          //setTnRepoTree(tnTree.tree)
          _tree = trees.tree
          let _url;
          for (let i=0; i < _tree.length; i++) {
            if (_tree.tree[i].path === "manifest.yaml") {
              _url = _tree.tree[i].url
              break
            }
          }
          if ( _url ) {
            // get the manifest
            const __manifest = await doFetch(_url,
              authentication, HTTP_GET_MAX_WAIT_TIME)
              .then(response => {
                if (response?.status !== 200) {
                  errorCode = response?.status
                  console.warn(`AdminContext - error fetching tn manifest, status code ${errorCode}`)
                  return null
                }
                return response?.data
            })
            if ( __manifest === null ) {
              //setTnRepoTreeErrorMessage("Unable to retrieve manifest")
              _errorMessage = "Unable to retrieve manifest"
            } else {
              if (__manifest.content && (__manifest.encoding === 'base64')) {
                const _content = decodeBase64ToUtf8(__manifest.content)
                const manifestObj = YAML.safeLoad(_content)
                //setTnRepoTreeManifest(manifestObj)
                _manifest = manifestObj
              } else {
                //setTnRepoTreeErrorMessage("Unable to decode manifest")
                _errorMessage = "Unable to decode manifest"
              }
            }
          } else {
            //setTnRepoTreeErrorMessage("No manifest found")
            _errorMessage = "No manifest found"
          }
        } else {
          //setTnRepoTreeErrorMessage("No files in repo")
          _errorMessage = "No files in repo"
        }
        setValues({tnRepoTree: _tree, tnManifest: _manifest, tnRepoTreeErrorMessage: _errorMessage})
      } catch (e) {
        const message = e?.message
        const disconnected = isServerDisconnected(e)
        console.warn(`AdminContext - error fetching repos tree, message '${message}', disconnected=${disconnected}`, e)
      }
    }

    if (authentication && owner && server && languageId) {
      getReposTrees()
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])


  return {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeErrorMessage,
    },
  }

}