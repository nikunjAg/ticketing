import { sendRequest } from "./axios-client";


export const getAllTickets = async (headers) => {

  try {
    const data = await sendRequest({
      method: "GET",
      url: "/api/tickets",
      headers,
    });
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }

}

export const createNewTicket = async (payload, headers) => {

  try {
    const response = await sendRequest({
      method: "POST",
      url: "/api/tickets",
      data: payload,
      headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response?.data?.errors[0]?.message || 'Something went wrong!!';
    return {
      error: errorMessage
    };
  }

}

export const getTicketById = async (ticketId, headers) => {

  try {
    const response = await sendRequest({
      method: "GET",
      url: "/api/tickets/" + ticketId,
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