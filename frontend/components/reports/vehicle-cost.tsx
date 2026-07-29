import { VehicleCost } from "@/types/report";


interface Props{
  data:VehicleCost[];
}


export default function VehicleCostCard({data}:Props){


 return(

  <div className="bg-panel border border-hairline rounded-[10px] p-6">


    <h2 className="text-lg font-bold font-heading text-ink mb-6">
      Top Costliest Vehicles
    </h2>



    {
      data.map((vehicle)=>(

        <div
          key={vehicle.vehicleId}
          className="mb-5"
        >


          <div className="flex justify-between text-[0.875rem] text-ink">

            <span className="font-medium">
              {vehicle.vehicleId}
            </span>


            <span className="tabular-nums font-mono font-bold">
              ₹{vehicle.cost}
            </span>


          </div>



          <div className="h-2 bg-panel-raised rounded-full mt-2 overflow-hidden">


            <div

              className="h-full bg-stop rounded-full transition-all duration-500"

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