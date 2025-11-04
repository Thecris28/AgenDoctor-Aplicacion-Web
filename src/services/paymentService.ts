import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.47.66.153:3000/api/v1/transbank';

interface TransactionRequest {
  buy_order: string;
  session_id: string;
  amount: number;
  return_url: string;
}

export const createTransaction = async (data: TransactionRequest) => {
  try {
    const response = await axios.post(`${API_URL}/transaction/create`, data);
    console.log('Respuesta de createTransaction:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating WebPay transaction:', error);
    throw new Error('No se pudo iniciar la transacción de pago');
  }
};

export const commitTransaction = async (token: string) => {
  try {
    const response = await axios.put(`${API_URL}/transaction/commit/${token}`);
    return response.data;
  } catch (error) {
    console.error('Error committing WebPay transaction:', error);
    throw new Error('No se pudo confirmar la transacción de pago');
  }
};

export const cancelTransaction = async (token: string, amount: number) => {
  try {
    const response = await axios.post(`${API_URL}/transaction/reverse-or-cancel/${token}`, {
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling WebPay transaction:', error);
    throw new Error('No se pudo cancelar la transacción de pago');
  }
}; 