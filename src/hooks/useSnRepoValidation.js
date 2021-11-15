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


export default function useSnRepoValidation({authentication, owner, server, languageId}) {

  const [snRepoTree, setSnRepoTree] = useState({})
  const [snRepoTreeManifest, setSnRepoTreeManifest] = useState({})
  const [snRepoTreeErrorMessage, setSnRepoTreeErrorMessage] = useState(null)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_sn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_sn/git/trees/master?recursive=false&per_page=999999`
      let errorCode = 0
      try {
        const snTree = await doFetch(url,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
              return null
            }
            return response?.data
          })

          if (snTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setSnRepoTreeErrorMessage("Repo Not Found")
          } else {
            setSnRepoTreeErrorMessage(null)
          }
          if ( snTree.tree ) {
            setSnRepoTree(snTree.tree)
            let _url;
            for (let i=0; i < snTree.tree.length; i++) {
              if (snTree.tree[i].path === "manifest.yaml") {
                _url = snTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const snManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching sn manifest, status code ${errorCode}`)
                    return null
                  }
                  return response?.data
              })
              if ( snManifest === null ) {
                setSnRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (snManifest.content && (snManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(snManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setSnRepoTreeManifest(manifestObj)
                } else {
                  setSnRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setSnRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setSnRepoTreeErrorMessage("No files in repo")
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
      snRepoTree,
      snRepoTreeManifest,
      snRepoTreeErrorMessage,
    },
  }

}