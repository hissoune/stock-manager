import axios from 'axios';
// Make sure you're logging any issues in the `uploadImageToMinio` function
export const uploadImageToBackend = async (imageUri: string): Promise<string | null> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const file = new File([blob], 'product-image.jpg', { type: blob.type });

  const formData = new FormData();
formData.append('file', {
  uri: imageUri,
  type: 'image/jpeg',
  name: 'image.jpg',
});

const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

try {
  const response = await axios.post('http://192.168.9.40:4000/upload', formData, config);
  return response.data.imageUrl
} catch (error) {
  console.error('Error uploading image:', error);
}

};
