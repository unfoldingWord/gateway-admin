import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AuthContext } from '@context/AuthContext'
import { apiPath } from '@common/constants'
import * as dcsApis from '@utils/dcsApis'
import Path from 'path'

const TRANSLATION_CONTEXT_REPO = 'translation-context'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
  },
  label: {
    marginRight: 8,
  },
  ok: {
    color: '#07b811',
  },
  createButton: {
    color: theme.palette.primary.main,
    border: '1px solid #0089C7',
  },
}))

/**
 * Org-level control to check for / create the "translation-context" repo.
 * Unlike per-book resource repos, this repo is literally named
 * "translation-context" (no language prefix) and needs no manifest.
 */
export default function TranslationContextControl({ server, owner }) {
  const classes = useStyles()

  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  // null = unknown/checking, true = exists, false = missing
  const [exists, setExists] = useState(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkRepo() {
      setExists(null)
      const tokenid = authentication?.token?.sha1

      if (!tokenid || !server || !owner) {
        return
      }

      const uri = server + '/' + Path.join(apiPath, 'repos', owner, TRANSLATION_CONTEXT_REPO)

      try {
        const res = await fetch(uri + '?token=' + tokenid)

        if (!cancelled) {
          setExists(res.status === 200)
        }
      } catch (e) {
        console.log('TranslationContextControl - error checking repo:', e)
        if (!cancelled) {
          setExists(false)
        }
      }
    }

    checkRepo()

    return () => { cancelled = true }
  }, [server, owner, authentication])

  async function handleCreate() {
    const tokenid = authentication?.token?.sha1

    setCreating(true)

    try {
      const res = await dcsApis.repoCreate({
        server,
        username: owner,
        repository: TRANSLATION_CONTEXT_REPO,
        tokenid,
      })

      if (res.status === 201) {
        console.log(`Repo Created! Server:${server}, Owner:${owner}, Repo:${TRANSLATION_CONTEXT_REPO}`)
        setExists(true)
      } else {
        console.log('Repo Create Error:', res)
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.label} variant="body2">
        Translation Context Repo ({TRANSLATION_CONTEXT_REPO}):
      </Typography>
      {exists === null || creating ? (
        <CircularProgress size={20} />
      ) : exists ? (
        <Tooltip title="Repo exists">
          <CheckCircleIcon className={classes.ok} aria-label="translation-context-exists" />
        </Tooltip>
      ) : (
        <Tooltip title="Create translation-context repo">
          <IconButton
            className={classes.createButton}
            onClick={handleCreate}
            aria-label="Create translation-context repo"
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

TranslationContextControl.propTypes = {
  server: PropTypes.string,
  owner: PropTypes.string,
}
