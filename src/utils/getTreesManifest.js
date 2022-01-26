import YAML from 'js-yaml-parser'
import {
  NO_FILES_IN_REPO,
  REPO_NOT_FOUND,
  NO_MANIFEST_FOUND,
  UNABLE_TO_DECODE_MANIFEST,
  UNABLE_TO_RETRIEVE_MANIFEST,
  MANIFEST_NOT_YAML,
} from '@common/constants'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import {decodeBase64ToUtf8} from '@utils/decode'

export async function getTreesManifest(authentication, url) {
  let errorCode = 0
  let _tree = null
  let _manifest = null
  let _manifestSha = null
  let _errorMessage = null
  try {
    const trees = await doFetch(url,
      authentication)
      .then(response => {
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`getTreesManifest() - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
          return null
        }
        return response?.data
    })
    if (trees === null) { // if no repo
      _errorMessage = REPO_NOT_FOUND
    } else if ( trees.tree ) {
      _tree = trees.tree
      let _url;
      for (let i=0; i < _tree.length; i++) {
        if (_tree[i].path === "manifest.yaml") {
          _url = _tree[i].url
          break
        }
      }
      if ( _url ) {
        // get the manifest
        const __manifest = await doFetch(_url,
          authentication)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`getTreesManifest() - error fetching manifest, status code ${errorCode},
                url ${_url}
              `)
              return null
            }
            return response?.data
        })
        if ( __manifest === null ) {
          _errorMessage = UNABLE_TO_RETRIEVE_MANIFEST
        } else {
          if (__manifest.content && (__manifest.encoding === 'base64')) {
            const _content = decodeBase64ToUtf8(__manifest.content)
            const manifestObj = YAML.safeLoad(_content)
            _manifest = manifestObj
            _manifestSha = __manifest.sha
            if ( typeof(manifestObj) !== "object" ) {
              _errorMessage = MANIFEST_NOT_YAML
            }
          } else {
            _errorMessage = UNABLE_TO_DECODE_MANIFEST
          }
        }
      } else {
        _errorMessage = NO_MANIFEST_FOUND
      }
    } else {
      _errorMessage = NO_FILES_IN_REPO
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`getTreesManifest() - error fetching repos tree,
      message '${message}',
      disconnected=${disconnected},
      url ${url}
      Error:`, 
      e)
    //_errorMessage = "Network error fetching repo tree"
  }
  return {RepoTree: _tree, Manifest: _manifest, ManifestSha: _manifestSha, RepoTreeStatus: _errorMessage}
}
