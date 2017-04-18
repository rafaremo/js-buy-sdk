import assert from 'assert';
import GraphQLJSClient, {decode} from 'graphql-js-client';
import productNodeQuery from '../src/product-node-query';
import productHelpers from '../src/product-helpers';
import singleProductFixture from '../fixtures/product-fixture';
import types from '../types';

suite('product-helpers-test', () => {
  const query = productNodeQuery();
  const graphQLClient = new GraphQLJSClient(types, {url: 'https://sendmecats.myshopify.com/api/graphql'});
  const rootQuery = graphQLClient.query((root) => {
    query(root, 'node', '7857989384');
  });
  const productModel = decode(rootQuery, singleProductFixture.data);

  test('it returns the variant based on options given', () => {
    const variant = productHelpers.variantForOptions(productModel.node, {Fur: 'Fluffy', Size: 'Medium'});

    assert.equal(variant.id, 'gid://shopify/ProductVariant/25602235976');
  });

  test('it returns undefined if the variant does not exist', () => {
    const variant = productHelpers.variantForOptions(productModel.node, {Fur: 'Fluffy', Size: 'Small'});

    assert.equal(typeof variant, 'undefined');
  });
});
