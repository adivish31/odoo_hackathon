import axios from "axios";


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



export interface FuelLog {

  id:string;

  vehicleId:string;

  tripId?:string;

  liters:number;

  amount:number;

  date:string;

  vehicle:{
    id:string;
    registrationNumber:string;
  };

}



export async function getFuelLogs(
  vehicleId?:string,
  tripId?:string
){

  const res = await api.get<FuelLog[]>(
    "/api/fuel-logs",
    {
      params:{
        vehicleId,
        tripId,
      },
    }
  );


  return res.data;

}



export async function addFuelLog(
  data:Partial<FuelLog>
){

  const res = await api.post(
    "/api/fuel-logs",
    data
  );


  return res.data;

}