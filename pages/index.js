import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';
import baseURL from '../utils/baseURL';

function Home({ products, totalPages }) {
  // create Card group of all the products
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

// fetch products data on the server and merge it with existing props
Home.getInitialProps = async (ctx) => {
  // define the current page and docs per page
  const page = ctx.query.page ? ctx.query.page : '1';
  const size = 12;
  // construct request
  const payload = { params: { page, size } };
  const response = await axios.get(`${baseURL}/api/products`, payload);
  return response.data;
};

export default Home;
