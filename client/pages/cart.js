import useRequest from "../hooks/useRequest"
import Router from "next/router";
import StripeCheckout from 'react-stripe-checkout';
import createServer from "next/dist/server/next";

const Cart = ({ cart,currentUser }) => {
  const { request, errors } = useRequest({});
  const amount = 0
  const  submitPayment = async(token) => {
    const response = await request({
      url:"/api/payments",
      method:"post",
      body:{
        items: cart.items,
        token:token
      }
      })
      if(response) Router.push('/')
  }

  const itemList = cart.items.map((item) => {
    amount+=item.price
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td><img src={item.image} style={{width:"80%",height:40}}/></td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Cart</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{itemList}</tbody>
      </table>
      <div>
      <StripeCheckout
        
        token={(token) => submitPayment(token)}
        stripeKey="pk_test_51IXYlqLPv72WzHs5KaNPQ6SL5LplSbhiSKMihPrBVXbFkGIsHEYIwI3phyLUVik3P03sfNqUPsNgxvEaQopJt4m300EUYPEulN"
        amount={amount * 100}
        email={currentUser.email}
    >
    <button className="btn btn-primary">
    Purchase
    </button>
    </StripeCheckout>
      </div>
      Total:${amount}
    </div>

  );
};

Cart.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/cart`);

  return { cart: data };
};

export default Cart;