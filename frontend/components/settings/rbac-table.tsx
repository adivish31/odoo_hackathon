import { RolePermission } from "@/types/settings";
import { Check, Eye, X } from "lucide-react";


export default function RbacTable(
{
roles
}:{
roles:RolePermission[]
}
){


const icon=(value:string)=>{
  if(value==="full")
    return <Check size={16} strokeWidth={1.75} className="text-go inline" />;

  if(value==="read")
    return <Eye size={16} strokeWidth={1.75} className="text-reflect inline" />;

  return <X size={16} strokeWidth={1.75} className="text-stop inline" />;
}



return (

<div className="
bg-panel
border border-hairline
rounded-[10px]
overflow-hidden
">


<div className="p-6 border-b border-hairline">

<h2 className="font-bold text-xl font-heading tracking-[0.01em]">
Role Based Access (RBAC)
</h2>


</div>


<div className="overflow-x-auto">


<table className="w-full">

<thead className="bg-panel">

<tr>

<th className="p-4 text-left font-semibold uppercase tracking-[0.08em] text-[0.75rem] text-ink-dim">
Role
</th>

<th className="font-semibold uppercase tracking-[0.08em] text-[0.75rem] text-ink-dim">Fleet</th>
<th className="font-semibold uppercase tracking-[0.08em] text-[0.75rem] text-ink-dim">Drivers</th>
<th className="font-semibold uppercase tracking-[0.08em] text-[0.75rem] text-ink-dim">Trips</th>
<th className="font-semibold uppercase tracking-[0.08em] text-[0.75rem] text-ink-dim">Expenses</th>
<th className="font-semibold uppercase tracking-[0.08em] text-[0.75rem] text-ink-dim">Analytics</th>


</tr>

</thead>



<tbody>


{
roles.map((role)=>(

<tr
key={role.role}
className="border-t border-hairline hover:bg-panel-raised transition-colors"
>


<td className="p-4 font-semibold text-ink">
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