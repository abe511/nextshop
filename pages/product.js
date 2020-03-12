import axios from 'axios';
import ProductSummary from '../components/Product/ProductSummary';
import ProductAttributes from '../components/Product/ProductAttributes';
import baseURL from '../utils/baseURL';

function Product({ product, user }) {
  return (
    <>
      <ProductSummary user={user} {...product} />
      <ProductAttributes user={user} {...product} />
    </>
  );
}

// fetch product details on the server using product id from context query
Product.getInitialProps = async ({ query }) => {
  const payload = { params: { _id: query._id } };
  const response = await axios.get(`${baseURL}/api/product`, payload);
  return { product: response.data };
};

export default Product;
