// index.js

const url = require('url')
const axios = require('axios')

module.exports = {
  onSuccess: async ({ packageJson, netlifyConfig }) => {
    const { deployUrl, branchName, pullBranch, appFullName } = getEnvironment(netlifyConfig, packageJson)
    const content = `${appFullName} for branch ${branchName} generated by ${pullBranch}, successfully published at ${deployUrl}`
    console.log('Zulip notification of on Success', content)
    await zulipNotify(appFullName, branchName, content)
  },
  onError: async ({ packageJson, netlifyConfig }) => {
    const { branchName, pullBranch, appFullName } = getEnvironment(netlifyConfig, packageJson)
    const content = `#### Error deploying ${appFullName} for branch ${branchName} generated by ${pullBranch} ####`
    console.log('Zulip notification of on Error', content)
    await zulipNotify(appFullName, branchName, content)
  },
}

function getEnvironment(netlifyConfig, packageJson) {
  const environment = netlifyConfig.build.environment
  const deployUrl = environment.DEPLOY_PRIME_URL
  const branchName = environment.BRANCH
  const pullBranch = process.env.BRANCH
  const appName = packageJson.name
  const version = packageJson.version
  const appFullName = `${appName} v${version}`
  return {
    appName,
    appFullName,
    branchName,
    deployUrl,
    pullBranch,
    version,
  }
}

async function zulipNotify(appName, branchName, content) {
  try {
    const token = process.env.ZULIP_TOKEN
    const username = process.env.ZULIP_USER

    const data = {
      to: 'SOFTWARE - UR/github',
      subject: `${appName} - ${branchName}`,
      content,
      type: 'stream',
    }
    console.log('Sending Zulip Notification', data)
    const params = new url.URLSearchParams(data)

    await axios.post('https://unfoldingword.zulipchat.com/api/v1/messages',
      params.toString(),
      {
        auth: {
          username,
          password: token,
        },
      })
  } catch (error) {
    console.error('error Sending Zulip notification', error)
  }
}

