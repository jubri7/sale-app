import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const OrderShow = ({ order,currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { request, errors } = useRequest({});

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  const submitPayment = async (token) =>{
    const response = await request({
      url:"/api/payments",
      method:"post",
      body:{
        orderId: order.id,
        token:token
      }
    })

    if(response)Router.push("/orders/myorders")
    
  }

  if(timeLeft <= 0)return <div>Order has expired</div>

  return (
  <div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout
            token={(token) => submitPayment(token)}
            stripeKey="pk_test_51IXYlqLPv72WzHs5KaNPQ6SL5LplSbhiSKMihPrBVXbFkGIsHEYIwI3phyLUVik3P03sfNqUPsNgxvEaQopJt4m300EUYPEulN"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
  </div>)
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
