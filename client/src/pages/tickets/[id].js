import React, { useState } from 'react';

import { getTicketById } from '@/lib/ticket';
import TicketDetail from '@/components/Tickets/TicketDetail';
import { createNewOrder } from '@/lib/order';

const Ticket = ({ ticket: ticketData, error }) => {

  const [ticket, setTicket] = useState(ticketData);

  const updateTicketHandler = async () => {
    const response = await getTicketById(ticket.id);
    if (response.error) {
      console.log(response.error);
    } else {
      setTicket(response.data.ticket);
    }
  }

  const orderTicketHandler = async () => {
    const response = await createNewOrder({ ticketId: ticket.id });

    if (response.error) {
      console.log(response.error);
    } else {
      console.log(response.data);
      updateTicketHandler();
    }
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <TicketDetail
      ticket={ticket}
      onOrder={orderTicketHandler}
    />
  );
}

export async function getServerSideProps({ params }) {
  const ticketId = params.id;

  const response = await getTicketById(ticketId);

  if (response.status === 404) {
    return {
      notFound: true,
    }
  } else if (response.error) {
    return {
      props: {
        error: response.error,
      }
    }
  } else {
    return {
      props: {
        ticket: response.data.ticket,
      }
    }
  }

}

export default Ticket