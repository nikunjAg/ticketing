import React from 'react';

import { getAllTickets } from '@/lib/ticket';
import AllTickets from '@/components/Tickets/AllTickets';

const Tickets = (props) => {
  return (
    <AllTickets tickets={props.tickets} />
  );
}

export async function getServerSideProps({req}) {
  const response = await getAllTickets(req.headers);

  const tickets = response.data?.tickets || [];
  console.log(JSON.stringify(response.data, null, 2));
  return {
    props: {
      tickets,
    }
  }

}

export default Tickets;