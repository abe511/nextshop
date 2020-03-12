import { useState } from 'react';
import { Header, Button, Modal } from 'semantic-ui-react';
import axios from 'axios';
import baseURL from '../../utils/baseURL';
import { useRouter } from 'next/router';

function ProductAttributes({ _id, description, user }) {
  // state for showing and hiding Delete Confirmation dialog
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isAdminOrRoot = isAdmin || isRoot;

  //  Product DELETE request
  async function handleDelete() {
    const payload = { params: { _id } };
    await axios.delete(`${baseURL}/api/product`, payload);
    router.push('/');
  }

  return (
    <>
      <Header as="h3">Product Description</Header>
      <p>{description}</p>
      {isAdminOrRoot && (
        <>
          <Button
            color="red"
            icon="trash alternate outline"
            content="Delete Product"
            onClick={() => {
              setModal(true);
            }}
          />
          {/* Confirm delete dialog */}
          <Modal open={modal} dimmer="blurring">
            <Modal.Header>Confirm delete</Modal.Header>
            <Modal.Content>
              You are about to delete this product. Are you sure?
            </Modal.Content>
            <Modal.Actions>
              <Button
                content="Cancel"
                onClick={() => {
                  setModal(false);
                }}
              />
              <Button
                negative
                labelPosition="right"
                icon="trash"
                content="Delete"
                onClick={handleDelete}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductAttributes;
