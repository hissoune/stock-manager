import * as yup from 'yup';

const stockSchema = yup.object().shape({
  id: yup.number().required('Stock ID is required'),
  name: yup.string().required('Stock name is required'),
  quantity: yup.number().min(0, 'Quantity cannot be negative').required('Quantity is required'),
  localisation: yup.object().shape({
    city: yup.string().required('City is required'),
    latitude: yup.number().required('Latitude is required'),
    longitude: yup.number().required('Longitude is required'),
  }),
});

const productSchema = yup.object().shape({
  id: yup.string().required('Product ID is required'),
  name: yup.string().required('Product name is required'),
  type: yup.string().required('Product type is required'),
  barcode: yup
    .string()
    .matches(/^\d{13}$/, 'Barcode must be a 13-digit number')
    .required('Barcode is required'),
  price: yup.number().positive().required('Price is required'),
  solde: yup
    .number()
    .positive()
    .max(yup.ref('price'), 'Solde price cannot be greater than the original price')
    .nullable(),
  supplier: yup.string().required('Supplier name is required'),
  image: yup.string().required('Image URL is required'),
  stocks: yup.array().of(stockSchema),
});

export default productSchema;
