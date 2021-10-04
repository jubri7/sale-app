import { useState } from 'react';
import Router from "next/router";
import useRequest from "../hooks/useRequest"

const NewItem = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [file,setFile] = useState(null)
  const {request,errors} = useRequest({})

  const onSubmitHandler = async (e) =>{
      e.preventDefault()
      const formData = new FormData()
      formData.append('name',name)
      formData.append('price',price)
      formData.append('file',file)
      const response = await request({
          url:"/api/items",
          method:"post",
          data: formData
      })
      if (response) Router.push("/")
  }

  const onBlurHandler = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Item</h1>
      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlurHandler}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"

            onChange={(e) => setFile(e.target.files[0])}
            className="form-control"
          />
          </div>
        {errors && errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewItem;
