import { useEffect, useState } from 'react';
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



export default function useTwlRepoValidation({authentication, owner, server, languageId}) {

  const [twlRepoTree, setTwlRepoTree] = useState({})
  const [twlRepoTreeManifest, setTwlRepoTreeManifest] = useState({})
  const [twlRepoTreeErrorMessage, setTwlRepoTreeErrorMessage] = useState(null)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_twl/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      const url = `${server}/api/v1/repos/${owner}/${languageId}_twl/git/trees/master?recursive=false&per_page=999999`
      let errorCode = 0
      try {
        const twlTree = await doFetch(url,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
              return null
            }
            return response?.data
          })

          if (twlTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setTwlRepoTreeErrorMessage("Repo Not Found")
          } else {
            setTwlRepoTreeErrorMessage(null)
          }
          if ( twlTree.tree ) {
            setTwlRepoTree(twlTree.tree)
            let _url;
            for (let i=0; i < twlTree.tree.length; i++) {
              if (twlTree.tree[i].path === "manifest.yaml") {
                _url = twlTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const twlManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching twl manifest, status code ${errorCode}`)
                    return null
                  }
                  return response?.data
              })
              if ( twlManifest === null ) {
                setTwlRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (twlManifest.content && (twlManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(twlManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setTwlRepoTreeManifest(manifestObj)
                } else {
                  setTwlRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setTwlRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setTwlRepoTreeErrorMessage("No files in repo")
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
      twlRepoTree,
      twlRepoTreeManifest,
      twlRepoTreeErrorMessage,
    },
  }

}