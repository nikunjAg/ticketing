import React, { useState } from 'react'
import { Container, Button, Typography, CircularProgress } from '@mui/material';
import { createNewOrder } from '@/lib/order';

const TicketDetail = (props) => {

  const { ticket, onOrder } = props;

  const [loading, setLoading] = useState(false);

  const orderTicketHandler = async () => {
    setLoading(true);
    await onOrder();
    setLoading(false);
  }

  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: 900, color: "#333" }}
      >
        {ticket.title}
      </Typography>
      <Typography variant="h6">Price: ₹{ticket.price}</Typography>
      {
        !ticket.order && 
        <Typography variant="h6">
         Status: Available
        </Typography>
      }
      {
        ticket.order && 
        <Button variant="outlined" sx={{marginTop: '8px'}} color='error' onClick={onOrder} disabled={loading} >
          Sold Out
        </Button>
      }
      {
        !ticket.order && 
        <Button variant="contained" sx={{marginTop: '8px'}} onClick={onOrder} disabled={loading} >
          {loading ? <CircularProgress size={24} /> : "Order Now"}
        </Button>
      }
    </Container>
  );
}

export default TicketDetail;