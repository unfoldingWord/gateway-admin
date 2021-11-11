import { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { ALL_BIBLE_BOOKS } from '@common/BooksOfTheBible'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'



export default function RepoValidationCard({
  bookId,
  classes
}) {

  const {
    state: {
      owner,
      server,
      languageId,
    },
  } = useContext(StoreContext)

  const { state: {
    tnRepoTree, 
    tnRepoTreeManifest,
    tnRepoTreeErrorMessage,
  } } = useContext(AdminContext)




  return (
    <Card title={ALL_BIBLE_BOOKS[bookId]} classes={classes} hideMarkdownToggle={true} >
      <p style={{ padding: '30px' }}>
        {ALL_BIBLE_BOOKS[bookId]} has bookId of "{bookId}". <br/>
        Owner is: {owner}.<br/>
        LanguageId is: {languageId}.<br/>
        Server is: {server}. <br/>
        TN Tree: {JSON.stringify(tnRepoTree).slice(0,16)} <br/>
        TN Manifest: {JSON.stringify(tnRepoTreeManifest).slice(0,16)} <br/>
        TN Err Msg: {tnRepoTreeErrorMessage}
      </p>
    </Card>
  )
}


RepoValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}
