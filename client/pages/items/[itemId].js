import useRequest from "../../hooks/useRequest"
import Router from "next/router";
import StripeCheckout from 'react-stripe-checkout';

const ItemShow = ({ item,currentUser }) => {
  const { request, errors } = useRequest({});
  const handleClick = async () =>{
    await request({
      url:"/api/cart",
      method:"post",
      body:{
        itemId: item.id
      }
      })
  }
  const  submitPayment = async(token) => {
    const response = await request({
      url:"/api/payments",
      method:"post",
      body:{
        items: [item.id],
        token:token
      }
      })
      if(response) Router.push('/')
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <img src={item.image} style={{width:"80%",height:"30%"}}></img>
      <h4>Price:$ {item.price}</h4>
      {errors}
        <button onClick={handleClick} className="btn btn-primary">Add to cart</button>
        <StripeCheckout
        
            token={(token) => submitPayment(token)}
            stripeKey="pk_test_51IXYlqLPv72WzHs5KaNPQ6SL5LplSbhiSKMihPrBVXbFkGIsHEYIwI3phyLUVik3P03sfNqUPsNgxvEaQopJt4m300EUYPEulN"
            amount={item.price * 100}
            email={currentUser.email}
        >
        <button className="btn btn-primary">
        Purchase
        </button>
        </StripeCheckout>
    </div>
  );
};

ItemShow.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`/api/items/${itemId}`);

  return { item: data };
};

export default ItemShow;