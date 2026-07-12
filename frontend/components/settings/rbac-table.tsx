import { RolePermission } from "@/types/settings";


export default function RbacTable(
{
roles
}:{
roles:RolePermission[]
}
){


const icon=(value:string)=>{


if(value==="full")
return "✅";


if(value==="read")
return "👁";


return "❌";


}



return (

<div className="
bg-white
border
rounded-xl
overflow-hidden
">


<div className="p-6 border-b">

<h2 className="font-bold text-xl">
Role Based Access (RBAC)
</h2>


</div>


<div className="overflow-x-auto">


<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">
Role
</th>

<th>Fleet</th>
<th>Drivers</th>
<th>Trips</th>
<th>Expenses</th>
<th>Analytics</th>


</tr>

</thead>



<tbody>


{
roles.map((role)=>(

<tr
key={role.role}
className="border-t"
>


<td className="p-4 font-semibold">
{role.role}
</td>


<td className="text-center">
{icon(role.fleet)}
</td>

<td className="text-center">
{icon(role.drivers)}
</td>

<td className="text-center">
{icon(role.trips)}
</td>

<td className="text-center">
{icon(role.expenses)}
</td>

<td className="text-center">
{icon(role.analytics)}
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