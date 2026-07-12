import { SettingsData } from "@/types/settings";
import { SlidersHorizontal } from "lucide-react";


export default function GeneralSettings(
{
data
}:{
data:SettingsData
}
){


return (

<div className="
bg-white
border
rounded-xl
p-6
space-y-6
">


<h2 className="
font-bold
text-xl
flex
items-center
gap-2
">

<SlidersHorizontal size={20}/>

General

</h2>



<div>

<label className="text-sm text-slate-500">
DEPOT NAME
</label>

<input
defaultValue={data.depotName}
className="
mt-2
w-full
rounded-lg
border
px-4
py-2
"
/>

</div>



<div>

<label className="text-sm text-slate-500">
CURRENCY
</label>


<select
defaultValue={data.currency}
className="
mt-2
w-full
rounded-lg
border
px-4
py-2
"
>

<option>INR</option>
<option>USD</option>
<option>EUR</option>

</select>


</div>



<div>

<label className="text-sm text-slate-500">
DISTANCE UNIT
</label>


<div className="flex gap-3 mt-3">


<button className="
flex-1
border
rounded-lg
py-3
bg-blue-50
text-blue-600
">

Kilometers

</button>


<button className="
flex-1
border
rounded-lg
py-3
">

Miles

</button>


</div>


</div>


</div>

)

}