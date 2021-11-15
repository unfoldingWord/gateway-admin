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

  const [tnRepoTree, setTnRepoTree] = useState({})
  const [tnRepoTreeManifest, setTnRepoTreeManifest] = useState({})
  const [tnRepoTreeErrorMessage, setTnRepoTreeErrorMessage] = useState(null)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_tn/git/trees/master?recursive=false&per_page=999999`
      let errorCode = 0
      try {
        const tnTree = await doFetch(url,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
              return null
            }
            return response?.data
          })

          if (tnTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setTnRepoTreeErrorMessage("Repo Not Found")
          } else {
            setTnRepoTreeErrorMessage(null)
          }
          if ( tnTree.tree ) {
            setTnRepoTree(tnTree.tree)
            let _url;
            for (let i=0; i < tnTree.tree.length; i++) {
              if (tnTree.tree[i].path === "manifest.yaml") {
                _url = tnTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const tnManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching tn manifest, status code ${errorCode}`)
                    return null
                  }
                  return response?.data
              })
              if ( tnManifest === null ) {
                setTnRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (tnManifest.content && (tnManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(tnManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setTnRepoTreeManifest(manifestObj)
                } else {
                  setTnRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setTnRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setTnRepoTreeErrorMessage("No files in repo")
          }
  
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