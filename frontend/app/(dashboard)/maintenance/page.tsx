import ServiceForm from "@/components/maintenance/service-form";
import MaintenanceKPI from "@/components/maintenance/maintenance-kpi";
import ServiceTable from "@/components/maintenance/service-table";

import { getMaintenance } from "@/services/maintenance.service";

import {
  Download,
  Plus
} from "lucide-react";


export default async function MaintenancePage() {


const maintenance = await getMaintenance();



return (

<div className="space-y-6">



{/* Header */}

<div
className="
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
"
>


<div>

<h1
className="
text-2xl
md:text-3xl
font-bold
text-slate-900
"
>
Maintenance Management
</h1>


<p className="text-sm md:text-base text-slate-500 mt-1">
Manage vehicle servicing, repairs and maintenance history.
</p>


</div>




<div
className="
flex
flex-col
sm:flex-row
gap-3
"
>


<button
className="
flex
items-center
justify-center
gap-2
rounded-lg
border
bg-white
px-4
py-2
text-sm
"
>

<Download size={18}/>

Export Logs

</button>




<button
className="
flex
items-center
justify-center
gap-2
rounded-lg
bg-blue-600
px-4
py-2
text-sm
text-white
"
>

<Plus size={18}/>

New Schedule

</button>



</div>



</div>







{/* Main Layout */}

<div
className="
grid
grid-cols-1
gap-6
lg:grid-cols-12
items-start
"
>





{/* Service Form */}

<div
className="
lg:col-span-4
"
>

<ServiceForm/>

</div>







{/* Right Section */}

<div
className="
lg:col-span-8
space-y-6
"
>




{/* KPI */}

<MaintenanceKPI
data={maintenance.kpis}
/>






{/* Table */}

<ServiceTable
data={maintenance.records}
/>





</div>





</div>





</div>

)

}