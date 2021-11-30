import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DraggableModal from 'translation-helps-rcl/dist/components/DraggableModal'
import Card from 'translation-helps-rcl/dist/components/Card'

export default function SelectBookPopup(
{
  onNext,
  showModal,
  setShowModal,
}) {


  const handleClickClose = () => {
    setShowModal(false)
  }


  return (
    <DraggableModal
      open={showModal}
      handleClose={handleClickClose}
    >
      <Card
        closeable
        title={'Select a Book'}
        onClose={handleClickClose}
        classes={{
          dragIndicator: 'draggable-dialog-title',
        }}
      >
        <div style={{ padding: '45px', fontWeight: 'bold' }}>
          Hello! You can drag me by holding on the drag icon.
        </div>
        <Button
          size='large'
          color='primary'
          className='my-3'
          variant='contained'
          onClick={onNext}
        >
          Next
        </Button>
      </Card>
    </DraggableModal>
  )
}

SelectBookPopup.propTypes = {
  /** On next button click event handler */
  onNext: PropTypes.func,
}
