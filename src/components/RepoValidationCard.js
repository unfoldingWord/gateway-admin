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

  const [tnMsg, setTnMsg] = useState("Manifest Not Found")

  const {
    state: {
      owner,
      server,
      languageId,
    },
  } = useContext(StoreContext)

  const { state: {tnRepoTree, tnRepoTreeErrorMessage} } = useContext(AdminContext)

  useEffect(() => {
    async function getManifest() {
      if ( tnRepoTreeErrorMessage ) {
        setTnMsg(tnRepoTreeErrorMessage);
      } else {
        const tnTree = tnRepoTree.tree;
        let _tnMsg = "Manifest Not Found"
        for (let i=0; i < tnTree.length; i++) {
          if (tnTree[i].path === "manifest.yaml") {
            _tnMsg = tnTree[i].path
            break
          }
        }
        setTnMsg(_tnMsg)
      }
      //const languages = await getGatewayLanguages()
      //setLanguages(languages || [])
    }

    getManifest()
  }, [tnRepoTree])



  return (
    <Card title={ALL_BIBLE_BOOKS[bookId]} classes={classes} hideMarkdownToggle={true} >
      <p style={{ padding: '30px' }}>
        {ALL_BIBLE_BOOKS[bookId]} has bookId of "{bookId}". <br/>
        Owner is: {owner}.<br/>
        LanguageId is: {languageId}.<br/>
        Server is: {server}. <br/>
        Translation Notes: {tnMsg}
      </p>
    </Card>
  )
}


RepoValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}
