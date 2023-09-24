import React, { useCallback, useEffect, useState } from 'react'
import { Container, Button, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';

let orderedFromQueryParam = false;

const TicketDetail = (props) => {

  const { ticket, onOrder } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const orderTicketHandler = useCallback(async () => {
    setLoading(true);
    await onOrder();
    setLoading(false);
  }, [onOrder]);

  useEffect(() => {
    if (router.isFallback || orderedFromQueryParam) return;
    const {order: orderQuery} = router.query;

    if (orderQuery === 'now' && !orderedFromQueryParam) {
      orderedFromQueryParam = true;
      orderTicketHandler();
    }

  }, [router, orderTicketHandler]);

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
        <Button variant="outlined" sx={{marginTop: '8px'}} color='error' disabled={loading} >
          Sold Out
        </Button>
      }
      {
        !ticket.order && 
        <Button variant="contained" sx={{marginTop: '8px'}} onClick={orderTicketHandler} disabled={loading} >
          {loading ? <CircularProgress size={24} /> : "Order Now"}
        </Button>
      }
    </Container>
  );
}

export default TicketDetail;