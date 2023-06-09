import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';

import { AppState, wrapper } from 'app/client/store';
import { fetchProduct } from 'app/client/store/slices/product';
import { useEffect, useState } from 'react';
import { ProductServiceInterface } from 'app/client/container/interfaces/product.service.interface';
import { TYPES } from 'app/client/container/types';
import { appContainer } from 'app/client/container';


const Product: NextPage = (props: any) => {
  const { product, profile } = props;

  const productService = appContainer.get<ProductServiceInterface>(TYPES.ProductService);


  const [prod, setProd] = useState(null);

  useEffect(() => {
    productService.getProduct('productId').then(response => {
      setProd(response);
    });
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="row">
        <h1>
          THE PRODUCT FROM THE SERVICE: {prod}
        </h1>
        <br />
        <br />
        <h1 className="text-center">
          Product name: {product?.name}
        </h1>
        <h3>Profile: {profile?.name}</h3>
        <p>
          Go to <Link href="/">
            <a>Home page</a>
          </Link> {' | '}
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </p>

        <p>
          Product, {props.productData}!
        </p>
      </main>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query }) => {
  console.log('store state on the server before dispatch', store.getState());
  const productData = query.data || 'page data';
  //  http://localhost:3000/product?data='some-data'
  await store.dispatch(fetchProduct());
  console.log('store state on the server after dispatch', store.getState());

  return {
    props: {
      productData
    }
  };
});

const mapStateToProps = (state: AppState) => ({
  profile: state.profile,
  product: state.product
});

export default connect(mapStateToProps)(Product);
