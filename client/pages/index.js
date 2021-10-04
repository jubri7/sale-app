import Link from 'next/link';


const Landing = ({currentUser,items}) =>{
    const itemList = items.map((item) => {
        return (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td><img src={item.image} style={{width:"80%",height:40}}/></td>
            <td>
              <Link href="/items/[itemId]" as={`/items/${item.id}`}>
                <a><button className="btn btn-primary btn-small">Buy</button></a>
              </Link>
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
              </tr>
            </thead>
            <tbody>{itemList}</tbody>
          </table>
        </div>
      );
    };

Landing.getInitialProps = async (context,client) =>{
    const response = await client.get("/api/items")
    return {items:response.data}
}

export default Landing