import { getProducts, UpdateQuantity, updateInputQuantity, createProduct, updateProduct } from '../productsApi';
global.fetch = jest.fn() as jest.Mock;

describe('Product Service', () => {
  it('should create a new product', async () => {
    const productData = { name: 'New Product' };
    const mockResponse = { id: 1, name: 'New Product' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await createProduct(productData);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('/api/products', expect.any(Object));
  });

  it('should update a product', async () => {
    const productId = 1;
    const productData = { quantity: 5 };
    const mockResponse = { id: 1, quantity: 5 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await updateProduct(productId, productData);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(`/api/products/${productId}`, expect.any(Object));
  });
});
