import React from 'react'
import TicketPreview from './TicketPreview';
import { Box, Grid } from '@mui/material';

const AllTickets = (props) => {
  const { tickets } = props;

  if (!tickets || tickets.length == 0) return <p>No Ticket found</p>;

  return (
    <Box sx={{ flexGrow: 1 }} m={2} >
      <Grid container spacing={2} >
      {
        tickets.map(ticket => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ticket.id} >
            <TicketPreview ticket={ticket} />
          </Grid>
        ))
      }
      </Grid>
    </Box>
  )
}

export default AllTickets;