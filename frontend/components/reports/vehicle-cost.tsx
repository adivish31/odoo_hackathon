import { VehicleCost } from "@/types/report";


interface Props{
  data:VehicleCost[];
}


export default function VehicleCostCard({data}:Props){


 return(

  <div className="bg-white border rounded-xl p-6">


    <h2 className="text-lg font-semibold mb-6">
      Top Costliest Vehicles
    </h2>



    {
      data.map((vehicle)=>(

        <div
          key={vehicle.vehicleId}
          className="mb-5"
        >


          <div className="flex justify-between text-sm">

            <span className="font-medium">
              {vehicle.vehicleId}
            </span>


            <span>
              ₹{vehicle.cost}
            </span>


          </div>



          <div className="h-2 bg-slate-200 rounded-full mt-2">


            <div

              className="h-full bg-red-500 rounded-full"

              style={{
                width:`${Math.min(vehicle.cost/150,100)}%`
              }}

            />


          </div>


        </div>


      ))
    }


  </div>

 )

}