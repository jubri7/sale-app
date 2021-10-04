import axios from "axios";
import { useState } from "react";

const hook =  () => {
    const [errors,setErrors] = useState(null)

    const request = async ({url,method,body,data}) => {
        try {
            setErrors(null)
            const response= await axios[method](url,(data || body))

            return response
          
        } catch (error) {
            setErrors(
                <div className="alert alert-danger">
                <h4>Ooops....</h4>
                <ul className="my-0">
                  {error.response.data.errors.map(err=>(
                    <li key={err.message}>{err.message}</li>
                  ))}
                </ul>
              </div>
            )
        }
        
    }
    return {request,errors}
}

export default hook