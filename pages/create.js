import { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../utils/baseURL';
import catchErrors from '../utils/catchErrors';
import {
  Form,
  Input,
  Image,
  TextArea,
  Button,
  Message
} from 'semantic-ui-react';

function CreateProduct() {
  const INITIAL_PRODUCT = {
    name: '',
    price: '',
    quantity: '',
    media: '',
    description: ''
  };

  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [enable, setEnable] = useState(true);

  useEffect(() => {
    // check if all fields in the form are filled in
    const allFilled = Object.values(product).every((element) => {
      return element;
    });
    setEnable(allFilled);
  }, [product]);

  function handleChange(event) {
    const { name, value, files } = event.target;

    // reset success and errorMessage states
    if (success) {
      setSuccess(false);
    }
    if (errorMessage) {
      setErrorMessage('');
    }
    // check for changes in file input dialog
    if (name === 'media') {
      setProduct((prevState) => {
        return { ...prevState, media: files[0] };
      });
      // display image thumbnail
      setMediaPreview(URL.createObjectURL(files[0]));
    } else {
      // adding entered values to the product state (all except media)
      setProduct((prevState) => {
        return { ...prevState, [name]: value };
      });
    }
  }

  async function handleMediaUpload() {
    // construct the POST request to upload the image
    const data = new FormData();
    data.append('file', product.media);
    data.append('upload_preset', 'nextshop');
    data.append('cloud_name', 'absolutus');
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    return response.data.url;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      // upload the image to the cloud and receive the url
      const mediaUrl = await handleMediaUpload();
      // construct an object to send to product endpoint
      const url = `${baseURL}/api/product`;
      const { name, price, quantity, description } = product;
      const payload = { name, price, quantity, description, mediaUrl };
      await axios.post(url, payload);
      setSuccess(true);
      // clean up the form and state
      setProduct(INITIAL_PRODUCT);
      setMediaPreview('');
      setErrorMessage('');
    } catch (error) {
      // error handling func. callback writes error message to the state
      catchErrors(error, setErrorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    // show Header if no Success or Error message is true
    <>
      {!success && !errorMessage && (
        <Message
          header="Add new product."
          content="Recommended picture size is not less than 1000 pixels in any dimension."
          icon="add circle"
          color="blue"
        />
      )}
      <Form
        loading={loading}
        success={success}
        error={Boolean(errorMessage)}
        onSubmit={handleSubmit}
      >
        {success && (
          <Message
            icon="check"
            header="Done!"
            content="New Product has been added!"
            success
          />
        )}
        {errorMessage && (
          <Message icon="x" header="Error." content={errorMessage} error />
        )}
        <Form.Group widths="3">
          <Form.Field
            label="Name"
            control={Input}
            name="name"
            placeholder="Enter product name"
            onChange={handleChange}
            value={product.name}
            required
          />
          <Form.Field
            label="Price"
            control={Input}
            name="price"
            min="0.00"
            step="0.01"
            type="number"
            placeholder="Enter product price"
            onChange={handleChange}
            value={product.price}
            required
          />
          <Form.Field
            label="Quantity"
            control={Input}
            name="quantity"
            min="1"
            step="1"
            type="number"
            placeholder="Enter product quantity"
            onChange={handleChange}
            value={product.quantity}
            required
          />
        </Form.Group>
        <Form.Group widths="three">
          <Form.Field
            label="Description"
            control={TextArea}
            name="description"
            placeholder="Enter product description"
            onChange={handleChange}
            value={product.description}
            required
          />
          <Form.Field
            label="Image"
            control={Input}
            name="media"
            type="file"
            accept="image/*"
            content="Select product image"
            onChange={handleChange}
            required
          />
          <Form.Group>
            <Image
              src={mediaPreview}
              height="110em"
              floated="right"
              rounded
              centered
            />
          </Form.Group>
        </Form.Group>
        {/*disabled while empty fields exist or Loading */}
        <Form.Field
          control={Button}
          name="submit"
          type="submit"
          color="green"
          icon="pencil alternate"
          content="Submit"
          disabled={!enable || loading}
        />
      </Form>
    </>
  );
}

export default CreateProduct;
