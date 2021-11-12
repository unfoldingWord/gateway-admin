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


export default function useTqRepoValidation({authentication, owner, server, languageId}) {

  const [tqRepoTree, setTqRepoTree] = useState({})
  const [tqRepoTreeManifest, setTqRepoTreeManifest] = useState({})
  const [tqRepoTreeErrorMessage, setTqRepoTreeErrorMessage] = useState(null)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      let errorCode = 0
      try {
        const tqTree = await doFetch(`${server}/api/v1/repos/${owner}/${languageId}_tq/git/trees/master?recursive=false&per_page=999999`,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}`)
              return null
            }
            return response?.data
          })

          if (tqTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setTqRepoTreeErrorMessage("Repo Not Found")
          } else {
            setTqRepoTreeErrorMessage(null)
          }
          if ( tqTree.tree ) {
            setTqRepoTree(tqTree.tree)
            let _url;
            for (let i=0; i < tqTree.tree.length; i++) {
              if (tqTree.tree[i].path === "manifest.yaml") {
                _url = tqTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const tqManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching tq manifest, status code ${errorCode}`)
                    return null
                  }
                  return response?.data
              })
              if ( tqManifest === null ) {
                setTqRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (tqManifest.content && (tqManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(tqManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setTqRepoTreeManifest(manifestObj)
                } else {
                  setTqRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setTqRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setTqRepoTreeErrorMessage("No files in repo")
          }
  
      } catch (e) {
        const message = e?.message
        const disconnected = isServerDisconnected(e)
        console.warn(`AdminContext - error fetching repos tree, message '${message}', disconnected=${disconnected}`, e)
      }
    }

    if (authentication) {
      getReposTrees()
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])


  return {
    state: {
      tqRepoTree,
      tqRepoTreeManifest,
      tqRepoTreeErrorMessage,
    },
  }

}