
import { Product } from "@/constants/types";
import { UpdateQuantity } from "../../productsApi";

global.fetch = jest.fn();


describe('the stokck quanttity update tests ', ()=>{
    afterEach(() => {
        jest.clearAllMocks();
      });


      it("should successfully update a product", async () => {
            const Product: Product = {
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
        
            const mockUpdatedProduct = {
                ...Product,
                stocks: [
                  { id: 2991, name: "Lazari H2", quantity: 4, localisation: { city: "CityName", latitude: 0, longitude: 0 } },
                 
                ]
              };
            
              (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(Product),
              });

              (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockUpdatedProduct),
              });

             const result = await UpdateQuantity('add', '1', 2991, 101);     
             expect(result).toEqual(mockUpdatedProduct);

            expect(fetch).toHaveBeenCalledWith(
                `${process.env.EXPO_PUBLIC_URL}/products/1`,
                expect.objectContaining({
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: expect.stringContaining('"stocks":[{"id":2991,"name":"Lazari H2","quantity":4'),
                })
            );
        
            expect(result).toEqual(mockUpdatedProduct);
          });


          it("should successfully remove quantity from the stock", async () => {
            process.env.EXPO_PUBLIC_URL = "http://192.168.206.114:3000";
        
            const mockProduct = {
              id: "1",
              name: "PC 1",
              stocks: [
                { id: 2991, name: "Lazari H2", quantity: 3, localisation: { city: "CityName", latitude: 0, longitude: 0 } },
                { id: 2992, name: "Lazari H3", quantity: 5, localisation: { city: "CityName", latitude: 0, longitude: 0 } }
              ]
            };
        
            const mockUpdatedProduct = {
              ...mockProduct,
              stocks: [
                { id: 2991, name: "Lazari H2", quantity: 2, localisation: { city: "CityName", latitude: 0, longitude: 0 } },
                { id: 2992, name: "Lazari H3", quantity: 5, localisation: { city: "CityName", latitude: 0, longitude: 0 } }
              ]
            };
        
            (fetch as jest.Mock).mockResolvedValueOnce({
              ok: true,
              json: jest.fn().mockResolvedValueOnce(mockProduct),
            });
        
            (fetch as jest.Mock).mockResolvedValueOnce({
              ok: true,
              json: jest.fn().mockResolvedValueOnce(mockUpdatedProduct),
            });
        
            const result = await UpdateQuantity('remove', '1', 2991, 101);
        
            expect(result).toEqual(mockUpdatedProduct);
            expect(fetch).toHaveBeenCalledWith(
              `${process.env.EXPO_PUBLIC_URL}/products/1`,
              expect.objectContaining({
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: expect.stringContaining('"stocks":[{"id":2991,"name":"Lazari H2","quantity":2'),
              })
            );
          });

          it("should not remove quantity when stock is zero", async () => {
            process.env.EXPO_PUBLIC_URL = "http://192.168.206.114:3000";
          
            const mockProduct = {
              id: "1",
              name: "PC 1",
              stocks: [
                { id: 2991, name: "Lazari H2", quantity: 0, localisation: { city: "CityName", latitude: 0, longitude: 0 } },
                { id: 2992, name: "Lazari H3", quantity: 0, localisation: { city: "CityName", latitude: 0, longitude: 0 } }
              ]
            };
          
            (fetch as jest.Mock).mockResolvedValueOnce({
              ok: true,
              json: jest.fn().mockResolvedValueOnce(mockProduct),
            });
          
            (fetch as jest.Mock).mockResolvedValueOnce({
              ok: true,
              json: jest.fn().mockResolvedValueOnce(mockProduct), 
            });
          
            const result = await UpdateQuantity('remove', '1', 2991, 101);
          
            expect(result).toEqual(mockProduct);
            expect(fetch).toHaveBeenCalledTimes(2);  
          });
          
        
          it("should throw an error if the product fetch fails", async () => {
            process.env.EXPO_PUBLIC_URL = "http://192.168.206.114:3000";
        
            (fetch as jest.Mock).mockResolvedValueOnce({
              ok: false,
              statusText: "Internal Server Error",
              json: jest.fn().mockResolvedValueOnce({ error: "Failed" }),
            });
        
            await expect(
              UpdateQuantity('add', '1', 2991, 101)
            ).rejects.toThrow("Failed to fetch product: Internal Server Error");
        
            expect(fetch).toHaveBeenCalledTimes(1);
          });
        
})