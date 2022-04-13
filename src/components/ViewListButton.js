import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import VisibilityIcon from '@material-ui/icons/Visibility'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'

import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'


const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    backgroundColor: props => (props.active ? '#ffffff' : 'transparent'),
    '&:hover': {
      color: props => (props.active ? '#ffffff' : theme.palette.primary.main),
      backgroundColor: props => (props.active ? '#07b811' : '#ffffff'),
    },
    border: '1px solid #0089C7',
  },
}))

function ViewListButton({ active=true, title, value }) {

  const [showModal, setShowModal] = useState(false)

  const handleClickClose = () => {
    setShowModal(false)
  }
  const classes = useStyles({ active })
  return (
    <>
      <Tooltip title="View List of Missing Articles">
        <IconButton className={classes.iconButton} onClick={() => setShowModal(true)} aria-label="Create Repo">
          <VisibilityIcon />
        </IconButton>
      </Tooltip>

      <DraggableModal
        open={showModal}
        handleClose={handleClickClose}
      >
        <Card
          closeable
          title={`${title}`}
          onClose={handleClickClose}
          classes={{
            dragIndicator: 'draggable-dialog-title',
          }}
        >
          <div>
          <ul>
              {
                value?.Absent?.map( (item,index) => {
                  return (
                    <li key={index}>
                      {item}
                    </li>
                  )
                })
              }
              </ul>
          <TreeView aria-label="ViewList"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem nodeId="2" label="View Files Present">
              <ul>
              {
                value?.Present?.map( (item,index) => {
                  return (
                    <li key={index}>
                      {item}
                    </li>
                  )
                })
              }
              </ul>
            </TreeItem>
          </TreeView>

          </div>
        </Card>
      </DraggableModal>
    </>
  )
}

export default ViewListButton
/*

          <p>The filepaths/files missing are:</p>
          <ul>
          {
            value.map( (item,index) => {
              return (
                <li id={index}>
                  {item}
                </li>
              )
            })
          }
          </ul>
*/