import Link from "next/link";
import useRequest from "./hooks/useRequest";
import { useEffect, useState } from "react";

const Landing = ({ currentUser, initialItems }) => {
  const { request, errors } = useRequest({});
  const [items, setItems] = useState(initialItems);
  useEffect(async () => {
    const response = await request({
      url: "/api/items",
      method: "get",
    });
    setItems(response.data);
  }, []);
  const clickHandler = async (id) => {
    await request({
      url: `/api/items/${id}`,
      method: "delete",
      data: null,
    });
    const response = await request({
      url: "/api/items",
      method: "get",
    });
    setItems(response.data);
  };
  const itemList = items.map((item) => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>
          <img src={item.image} style={{ width: "80%", height: 40 }} />
        </td>
        <td>
          <Link href="/items/[itemId]" as={`/items/${item.id}`}>
            <a>
              <button className="btn btn-primary btn-small">Purchase</button>
            </a>
          </Link>
        </td>
        <td>
          {currentUser && currentUser.id == item.userId && (
            <button
              onClick={() => clickHandler(item.id)}
              className="btn btn-danger btn-small"
            >
              Delete
            </button>
          )}
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Items</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{itemList}</tbody>
      </table>
    </div>
  );
};

Landing.getInitialProps = async (context, client) => {
  const response = await client.get("/api/items");
  return { initialItems: response.data };
};

export default Landing;
