import { Product } from "@/constants/types";
import { updateProduct } from "../../productsApi";
global.fetch = jest.fn();

describe("testing the updateProduct function", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should successfully update a product", async () => {
      const updatedProduct: Product = {
        id: "1",
        name: "PC 1",
        price: "150",
        type: "Electronics",
        barcode: "123456789",
        solde: "10",
        supplier: "Supplier A",
        image: "image_url",
        stocks: [
          {
            id: 2991,
            name: "Lazari H2",
            quantity: 3,
            localisation: { city: "CityName", latitude: 0, longitude: 0 },
          },
          {
            id: 2992,
            name: "Lazari H3",
            quantity: 5,
            localisation: { city: "CityName", latitude: 0, longitude: 0 },
          },
        ],
        editedBy: [{ warehousemanId: 1, at: new Date() }],
      };
  
      const mockResponse = {
        ...updatedProduct,
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });
  
      const result = await updateProduct("1" ,updatedProduct);
  
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.EXPO_PUBLIC_URL}/products/${updatedProduct.id}`,
        expect.objectContaining({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        })
      );
  
      expect(result).toEqual(mockResponse);
    });
  
    it("should throw an error when the API request fails", async () => {
      const updatedProduct: Product = {
        id: "1",
        name: "PC 1",
        price: "150",
        type: "Electronics",
        barcode: "123456789",
        solde: "10",
        supplier: "Supplier A",
        image: "image_url",
        stocks: [
          {
            id: 2991,
            name: "Lazari H2",
            quantity: 3,
            localisation: { city: "CityName", latitude: 0, longitude: 0 },
          },
          {
            id: 2992,
            name: "Lazari H3",
            quantity: 5,
            localisation: { city: "CityName", latitude: 0, longitude: 0 },
          },
        ],
        editedBy: [{ warehousemanId: 1, at: new Date() }],
      };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });
  
      await expect(updateProduct("1",updatedProduct)).rejects.toThrow(
        "Failed to update product: Internal Server Error"
      );
  
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });