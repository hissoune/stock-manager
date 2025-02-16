import { Product } from "@/constants/types";
import { createProduct } from "../../productsApi";

global.fetch = jest.fn();

describe("testing the create product function ", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully add a product", async () => {
    process.env.EXPO_PUBLIC_URL = "http://192.168.206.114:3000";

    const newProduct:Product = {
      id: "1",
      name: "PC 1",
      price: "150",
      type: "Electronics",
      barcode: "123456789",
      solde: "10",
      supplier: "Supplier A",
      image: "image_url",
      stocks: [
        { id: 2991, name: "Lazari H2", quantity: 3, localisation: { city: "CityName", latitude: 0, longitude: 0 } },
        { id: 2992, name: "Lazari H3", quantity: 5, localisation: { city: "CityName", latitude: 0, longitude: 0 } }
      ],
      editedBy: [{warehousemanId: 1, at: new Date}],
    };

    const mockResponse = {
      ...newProduct,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await createProduct(newProduct);

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_URL}/products`,
      expect.objectContaining({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
    );
  });

  it("should throw an error when the API request fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
      json: jest.fn().mockResolvedValueOnce({ error: "Failed" }),
    });

    await expect(
      createProduct({
          id: "2",
          name: "PC 2",
          price: "200",
          stocks: [{ id: 2993, name: "Lazari H4", quantity: 10, localisation: { city: "CityName", latitude: 0, longitude: 0 } }],
          editedBy: [{ warehousemanId: 2, at: new Date() }],
          type: "",
          barcode: "",
          solde: "",
          supplier: "",
          image: null
      })
    ).rejects.toThrow("Failed to create product: Internal Server Error");

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});


