import useRequest from "../../hooks/useRequest"
import Router from "next/router";

const ItemShow = ({ item }) => {
  const { request, errors } = useRequest({});
  const onClickHandler = async() => {
      const response = await request({
        url: '/api/items',
        method: 'post',
        body: {
          ticketId: ticket.id,
        },
      })
      if(response) Router.push('/orders/[orderId]', `/orders/${response.data.id}`)
  }

  return (
    <div>
      <h1>{item.name}</h1>
      <h4>Price: {item.price}</h4>
      <img src={item.image}></img>
      {errors}
      <button onClick={onClickHandler} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`/api/tickets/${itemId}`);

  return { ticket: data };
};

export default TicketShow;