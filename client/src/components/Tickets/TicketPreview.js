import React from 'react';
import Link from 'next/link';
import { ChevronRight } from '@mui/icons-material';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import clsx from 'clsx';

const TicketPreview = (props) => {

  const { ticket } = props;

  return (
    <Card>
      <CardContent sx={{ padding: "8px 10px" }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Ticket : {ticket.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Price : ₹{ticket.price}
        </Typography>
        <Link
          className="link"
          href={"/tickets/" + ticket.id}
          style={{ padding: "6px 0px" }}
        >
          Show More <ChevronRight sx={{ fontSize: "1.2rem" }} />
        </Link>
      </CardContent>
      <CardActions>
        <Link
          className={clsx('linkBtn', ticket.order && 'btn-warning')}
          href={`/tickets/${ticket.id}?order=now`}
        >
          {ticket.order ? "Sold Out" : "Order Now"}
        </Link>
      </CardActions>
    </Card>
  );
}

export default TicketPreview;