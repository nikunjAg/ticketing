import { sendRequest } from "./axios-client";

export const getAllOrders = async (headers) => {

  try {
    const data = await sendRequest({
      method: "GET",
      url: "/api/orders",
      headers,
    });
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }

}

export const createNewOrder = async ({ ticketId }, headers) => {

  const payload = {
    ticketId,
  }

  try {
    const response = await sendRequest({
      method: "POST",
      url: "/api/orders",
      data: payload,
      headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response?.data?.errors || 'Something went wrong!!';
    return {
      error: errorMessage
    };
  }

}

export const getOrderById = async (orderId, headers) => {

  try {
    const response = await sendRequest({
      method: "GET",
      url: "/api/orders/" + orderId,
      headers,
    });
    return response;
  } catch (error) {
    console.log(error);
    const status = error.response?.data?.status;
    const errorMessage = error.response?.data?.errors[0]?.message || 'Something went wrong!!';
    return {
      status,
      error: errorMessage
    };
  }

}