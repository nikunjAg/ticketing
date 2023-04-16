import React, { useState } from 'react'
import { Alert, Button, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { useRouter } from 'next/router';

import classes from './tickets.module.css';
import { createNewTicket } from '@/lib/ticket';

const NewTicketForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState({value: "", touched: false});
  const [price, setPrice] = useState({value: 0, touched: false});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isTitleValid = title.value.trim().length > 0;
  const isPriceValid = price.value >= 0 && !isNaN(parseFloat(price.value));

  const titleHasError = title.touched && !isTitleValid;
  const priceHasError = price.touched && !isPriceValid;

  const setTitleHandler = (event) => {
    setTitle({ value: event.target.value, touched: true });
  }

  const setPriceHandler = (event) => {
    setPrice({ value: event.target.value, touched: true });
  }
  
  const priceBlurHandler = (event) => {
    const priceValue = event.target.value;
    const parsedPrice = parseFloat(priceValue);

    setPrice(prev => ({ ...prev, value: parsedPrice.toFixed(2) }));
  }

  const createNewTicketHandler = async (event) => {
    event.preventDefault();

    if (!isTitleValid || !isPriceValid) return;
    setError(null);
    const payload = {
      title: title.value,
      price: price.value.toString(),
    };

    // Make an API hit to create a new ticket
    setLoading(true);
    const response = await createNewTicket(payload);
    setLoading(false);

    if (response.error) {
      setError(response.error);
    } else {
      const { ticket } = response;
      router.replace(`/tickets/${ticket.id}`);
    }

  }

  return (
    <form className={classes.form} onSubmit={createNewTicketHandler} >
      <h3>Post New Ticket</h3>
      <br />
      {
        error && 
        <Alert className='alert' severity="error">{error}</Alert>
      }
      <TextField
        type="text"
        label="Title"
        placeholder="Enter Title..."
        variant="outlined"
        disabled={loading}
        value={title.value}
        onChange={setTitleHandler}
        error={titleHasError}
        helperText={titleHasError && "Please enter a valid title"}
      />
      <br />
      <TextField
        type="text"
        label="Price"
        placeholder="Price"
        variant="outlined"
        disabled={loading}
        value={price.value}
        onChange={setPriceHandler}
        onBlur={priceBlurHandler}
        InputProps={{
          inputProps: {
            min: 0
          },
          startAdornment: <InputAdornment position='start' >₹</InputAdornment>
        }}
        error={priceHasError}
        helperText={priceHasError && "Please enter a valid price"}
      />
      <br />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || !isPriceValid || !isTitleValid}
        className={classes.btn}
      >
        {loading ? <CircularProgress size={23} /> : "Post Ticket"}
      </Button>
    </form>
  )
}

export default NewTicketForm;