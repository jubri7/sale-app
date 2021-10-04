import { useEffect, useState } from "react";
import useRequest from "../hooks/useRequest";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";

const Cart = ({ initialCart, currentUser }) => {
  const { request, errors } = useRequest({});
  const [cart, setCart] = useState(initialCart);
  useEffect(() => {

  }, [cart.items]);
  const submitPayment = async (token) => {
    const response = await request({
      url: "/api/payments",
      method: "post",
      data: null,
      body: {
        items: cart.items,
        token: token,
      },
    });
    if (response) Router.push("/");
  };
  const clickHandler = async (id) => {
    await request({
      url: `/api/cart/${id}`,
      method: "delete",
      data: null,
      body: {
        itemId: id,
      },
    });
    const response = await request({
      url: "/api/cart",
      method: "get",
    });
    setCart(response.data);
  };

  const amount = 0.0;

  const itemList = cart.items.map((item) => {
    amount += parseFloat(item.price);
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>
          <img src={item.image} style={{ width: "80%", height: 40 }} />
        </td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => clickHandler(item.id)}
          >
            Remove
          </button>
        </td>
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
            <th>Remove Item</th>
          </tr>
        </thead>
        <tbody>{itemList || null}</tbody>
      </table>
      <div>
        <StripeCheckout
          token={(token) => submitPayment(token)}
          stripeKey="pk_test_51IXYlqLPv72WzHs5KaNPQ6SL5LplSbhiSKMihPrBVXbFkGIsHEYIwI3phyLUVik3P03sfNqUPsNgxvEaQopJt4m300EUYPEulN"
          amount={amount * 100}
          email={currentUser.email}
        >
          <button className="btn btn-primary">Purchase</button>
        </StripeCheckout>
      </div>
      Total:${amount.toFixed(2)}
    </div>
  );
};

Cart.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/cart`);

  return { initialCart: data };
};

export default Cart;
