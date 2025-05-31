import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../stores/store";
import { Modal } from "semantic-ui-react";

export default observer(function ModalContainer() {
  const { modalStore } = useStore();

  return (
    <Modal open={modalStore.modal.open} onClose={modalStore.closeModal} size="mini">
        <Modal.Content>
            {modalStore.modal.body}
        </Modal.Content>
    </Modal>
  )
});

//Because we don;t want to open modal on any page inside our app 
//we want to open this modal on some special pages, so we go to App.tsx then!!!
