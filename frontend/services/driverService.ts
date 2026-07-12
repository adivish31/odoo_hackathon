import axios from "axios";
import { Driver } from "@/types/driver";


const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000",
});


// Add token automatically
api.interceptors.request.use((config)=>{

  const token = localStorage.getItem("token");

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});



export async function getDrivers(
  search?: string,
  status?: string
){

  const res = await api.get<Driver[]>(
    "/api/drivers",
    {
      params:{
        search,
        status,
      },
    }
  );


  return res.data;

}



export async function addDriver(
  data: Partial<Driver>
){

  const res = await api.post(
    "/api/drivers",
    data
  );


  return res.data;

}



export async function updateDriver(
  id:string,
  data:Partial<Driver>
){

  const res = await api.put(
    `/api/drivers/${id}`,
    data
  );


  return res.data;

}



export async function deleteDriver(
  id:string
){

  await api.delete(
    `/api/drivers/${id}`
  );

}