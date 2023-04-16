import React from 'react';
import Link from 'next/link';
import { ArrowRightAlt, ChevronRight } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';


const TicketPreview = (props) => {

  const { ticket } = props;

  return (
    <Card>
      <CardContent sx={{ padding: "8px 10px" }}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          Ticket : {ticket.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Price : {ticket.price}
        </Typography>
        <Link
          className="link"
          href={"/tickets/" + ticket.id}
          style={{ padding: "6px 0px" }}
        >
          Show More <ChevronRight sx={{ fontSize: '1.2rem' }} />
        </Link>
      </CardContent>
      <CardActions>
        {ticket.order && (
          <Button variant="outlined" size='small' color='error'>
            Sold Out
          </Button>
        )}
        {!ticket.order && (
          <Button variant='outlined' size='small'>
            Order Now
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default TicketPreview;