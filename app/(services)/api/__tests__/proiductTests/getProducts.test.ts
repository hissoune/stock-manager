import { Product } from "@/constants/types";
import { getProducts } from "../../productsApi";

global.fetch = jest.fn();



describe("testing the get all products function ", () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully return a array of products ", async () => {
        process.env.EXPO_PUBLIC_URL = "http://192.168.206.114:3000";
        
        const products: Product[] = [{
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
          }]
    

          const mockResponse = {
            ...products,
          };

          (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse),
          });

        const result = await getProducts();

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.EXPO_PUBLIC_URL}/products`,
            expect.objectContaining({
              method: "GET",
              headers: { "Content-Type": "application/json" },
              
            })
          );
      
          expect(result).toEqual(mockResponse);
    });

     it("should throw an error when the API request fails", async () => {
         
          (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: "Internal Server Error",
          });
      
          await expect(getProducts()).rejects.toThrow(
            "Failed to get products : Internal Server Error"
          );
      
          expect(fetch).toHaveBeenCalledTimes(1);
        });


})