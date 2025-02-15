import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Feather } from '@expo/vector-icons';
import { Product } from '@/constants/types';
import { replaceIp } from '@/app/helpers/replaceIp';

interface ExportPDFButtonProps {
  product: Product;
  buttonStyle?: 'icon' | 'full';
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ product, buttonStyle = 'full' }) => {
  const generatePDFContent = () => {
    const stocksHTML = product.stocks?.map(stock => `
      <div style="margin: 10px 0; padding: 8px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h3 style="color: #2c3e50; margin-bottom: 10px;">${stock.name}</h3>
        <p style="margin: 5px 0;">Quantity: ${stock.quantity}</p>
        <p style="margin: 5px 0;">Location: ${stock.localisation.city}</p>
      </div>
    `).join('') || '<p style="text-align: center; color: #7f8c8d;">No stock available</p>';

    return `
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            h1 { 
              color: #4CAF50; 
              text-align: center; 
              font-size: 28px; 
              margin-bottom: 20px; 
            }
            h2 { 
              color: #2c3e50; 
              font-size: 22px; 
              margin-top: 30px; 
              margin-bottom: 15px; 
            }
            img { 
              display: block; 
              max-width: 300px; 
              height: auto; 
              margin: 20px auto; 
              border-radius: 8px; 
              box-shadow: 0 4px 8px rgba(0,0,0,0.1); 
            }
            .product-details, .stock-info { 
              background-color: #f9f9f9; 
              border-radius: 8px; 
              padding: 10px; 
              margin-bottom: 20px; 
            }
            .product-details p, .stock-info p { 
              margin: 10px 0; 
            }
          </style>
        </head>
        <body>
          <h1>${product.name}</h1>
          <div>
            <img src="${replaceIp(product.image || "", process.env.EXPO_PUBLIC_REPLACE || "")}" alt="${product.name}" />
          </div>
          <div class="product-details">
            <h2>Product Details</h2>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Sale Price:</strong> $${product.solde}</p>
            <p><strong>Supplier:</strong> ${product.supplier}</p>
          </div>
          <div class="stock-info">
            <h2>Stock Information</h2>
            ${stocksHTML}
          </div>
        </body>
      </html>
    `;
  };

  const exportToPDF = async () => {
    try {
      const html = generatePDFContent();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `${product.name} Details`
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  

  return (
    <TouchableOpacity onPress={exportToPDF} style={styles.button}>
      <Feather name="download" size={20} color="#FFFFFF" />
      <Text style={styles.buttonText}>Export PDF</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF9900',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop:25,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',

  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
 
});

export default ExportPDFButton;
