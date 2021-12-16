import packagefile from '../../package.json'

export const APP_VERSION = packagefile.version
export const APP_NAME = 'gatewayAdmin'
export const BASE_URL = 'https://git.door43.org'
export const QA_BASE_URL = 'https://qa.door43.org'
export const QA = 'QA'
export const PROD = 'PROD'
export const TOKEN_ID = 'gatewayAdmin'
export const FEEDBACK_PAGE = '/feedback'
export const SERVER_KEY = 'server'

export const SERVER_MAX_WAIT_TIME_RETRY = 10000 // in milliseconds
export const HTTP_GET_MAX_WAIT_TIME = 5 * 60 * 1000 // in milliseconds
export const HTTP_GET_CACHE_TIME = 60 * 60 * 1000 // in milliseconds, cache for 1 hour
export const HTTP_CONFIG = {
  cache: { maxAge: HTTP_GET_CACHE_TIME },
  timeout: HTTP_GET_MAX_WAIT_TIME,
}
// Necessary for edit mode.
export const RESOURCE_HTTP_CONFIG = {
  cache: { maxAge: 0 },
  timeout: HTTP_GET_MAX_WAIT_TIME,
}
// UI text - may eventually need to localize
export const MANIFEST_NOT_FOUND_ERROR = 'This resource manifest failed to load. Please confirm that the correct manifest.yaml file exists in the resource at:\n'
export const MANIFEST_INVALID_ERROR = 'The manifest for this resource is invalid. Resource is at:\n'
export const NO_ORGS_ERROR = 'The application can not continue. The current username is not part of a DCS organization. Please contact your administrator.'
export const ORGS_NETWORK_ERROR = 'Network Error loading User Organizations'
export const LOADING_RESOURCE = 'Loading Resource...'
export const LOCAL_NETWORK_DISCONNECTED_ERROR = 'No network connection was detected. Please reconnect your computer to the network and try again.'
export const SERVER_UNREACHABLE_ERROR = 'Please check your internet connection. The application is unable to reach the server.'
// eslint-disable-next-line no-template-curly-in-string
export const SERVER_OTHER_ERROR = 'The server returned an ${http_code} error. Please try again or submit feedback.'
export const AUTHENTICATION_ERROR = 'The application is no longer logged in. Please login again.'
export const CHECKING_SERVER = ' ... Checking for connection to server'
export const NETWORK_ERROR = `Network Error`
export const SEND_FEEDBACK = 'Send Feedback'
export const LOGIN = 'Login'
export const RETRY = 'Retry'
export const CANCEL = 'Cancel'
export const CLOSE = 'Close'
export const LOADING = 'Loading...'
export const WORKING = 'Working...'
export const REPO_NOT_FOUND = 'Repo not found'
export const OK = 'OK'
export const FILE_NOT_FOUND = 'File not found'
export const BOOK_NOT_IN_MANIFEST = 'Book not in manifest'
export const NO_FILES_IN_REPO = "No files in repo"
export const NO_MANIFEST_FOUND = "No manifest found"
export const UNABLE_TO_DECODE_MANIFEST = "Unable to decode manifest"
export const UNABLE_TO_RETRIEVE_MANIFEST = "Unable to retrieve manifest"

export const apiPath  = 'api/v1'
