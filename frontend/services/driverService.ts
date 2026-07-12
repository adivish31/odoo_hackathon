import axios from "axios";
import { Driver } from "@/types/driver";


const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api",
});


export async function getDrivers(){

  const res = await api.get<Driver[]>("/drivers");

  return res.data;

}


export async function addDriver(data:Driver){

  const res = await api.post(
    "/drivers",
    data
  );

  return res.data;

}