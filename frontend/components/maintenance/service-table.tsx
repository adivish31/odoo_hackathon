import { ServiceRecord } from "@/types/maintenance";


export default function ServiceTable({
data
}:{
data:ServiceRecord[]
}){


return(

<div className="
bg-white
rounded-xl
border
overflow-hidden
">


<div className="
p-5
border-b
">

<h2 className="
text-xl
font-semibold
">
Service Log
</h2>

</div>



<div className="
overflow-x-auto
">


<table className="
w-full
text-left
">


<thead className="bg-slate-100">

<tr>

<th className="p-4">
Vehicle
</th>

<th className="p-4">
Service
</th>

<th className="p-4">
Cost
</th>

<th className="p-4">
Status
</th>

</tr>

</thead>



<tbody>


{
data.map((item)=>(


<tr
key={item.id}
className="border-t hover:bg-slate-50"
>


<td className="p-4">

<p className="font-semibold">
{item.vehicle}
</p>

<p className="text-sm text-slate-500">
{item.model}
</p>

</td>



<td className="p-4">
{item.service}
</td>



<td className="p-4">
₹{item.cost}
</td>




<td className="p-4">

<span className="
rounded-full
bg-blue-100
px-3
py-1
text-xs
font-semibold
">

{item.status}

</span>


</td>


</tr>


))

}



</tbody>


</table>


</div>


</div>


)

}