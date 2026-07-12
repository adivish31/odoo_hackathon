import DriverStats from "@/components/drivers/DriverStats";
import DriverTable from "@/components/drivers/DriverTable";


export default function DriversPage(){

return(

<div className="p-6">


<div className="mb-6">

<h1 className="text-2xl font-bold">
Drivers & Safety Profiles
</h1>


<p className="text-slate-500">
Manage personnel, track licensing compliance, and monitor safety performance.
</p>


</div>


<DriverStats/>


<DriverTable/>


</div>

)

}