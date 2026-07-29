import DriverStats from "@/components/drivers/DriverStats";
import DriverTable from "@/components/drivers/DriverTable";


import { Users } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

export default function DriversPage(){

return(

<div className="p-6">


<PageHeader
  title="Drivers & Safety Profiles"
  description="Manage personnel, track licensing compliance, and monitor safety performance."
  icon={Users}
/>


<DriverStats/>


<DriverTable/>


</div>

)

}