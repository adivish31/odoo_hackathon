import axios from "axios";


const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000",
});


api.interceptors.request.use((config)=>{

  const token = localStorage.getItem("token");

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});



export interface Expense {

  id:string;

  vehicleId:string;

  tripId?:string;

  category:string;

  amount:number;

  date:string;

  vehicle:{
    id:string;
    registrationNumber:string;
  };

}



export async function getExpenses(
  vehicleId?:string,
  category?:string
){

  const res = await api.get<Expense[]>(
    "/api/expenses",
    {
      params:{
        vehicleId,
        category,
      },
    }
  );


  return res.data;

}




export async function addExpense(
  data:Partial<Expense>
){

  const res = await api.post(
    "/api/expenses",
    data
  );


  return res.data;

}