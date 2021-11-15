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


export default function useSqRepoValidation({authentication, owner, server, languageId}) {

  const [sqRepoTree, setSqRepoTree] = useState({})
  const [sqRepoTreeManifest, setSqRepoTreeManifest] = useState({})
  const [sqRepoTreeErrorMessage, setSqRepoTreeErrorMessage] = useState(null)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sq/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_sq/git/trees/master?recursive=false&per_page=999999`
      let errorCode = 0
      try {
        const sqTree = await doFetch(url,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
              return null
            }
            return response?.data
          })

          if (sqTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setSqRepoTreeErrorMessage("Repo Not Found")
          } else {
            setSqRepoTreeErrorMessage(null)
          }
          if ( sqTree.tree ) {
            setSqRepoTree(sqTree.tree)
            let _url;
            for (let i=0; i < sqTree.tree.length; i++) {
              if (sqTree.tree[i].path === "manifest.yaml") {
                _url = sqTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const sqManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching sq manifest, status code ${errorCode}`)
                    return null
                  }
                  return response?.data
              })
              if ( sqManifest === null ) {
                setSqRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (sqManifest.content && (sqManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(sqManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setSqRepoTreeManifest(manifestObj)
                } else {
                  setSqRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setSqRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setSqRepoTreeErrorMessage("No files in repo")
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
      sqRepoTree,
      sqRepoTreeManifest,
      sqRepoTreeErrorMessage,
    },
  }

}