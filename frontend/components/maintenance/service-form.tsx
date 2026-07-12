"use client";

import { useState } from "react";
import { Save } from "lucide-react";


export default function ServiceForm() {


const [form,setForm] = useState({
 vehicle:"",
 service:"",
 cost:"",
 date:"",
 status:"ACTIVE"
});


function handleChange(
e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
){

setForm({
 ...form,
 [e.target.name]:e.target.value
});

}



function handleSubmit(e:React.FormEvent){

e.preventDefault();

console.log(form);

// yaha baad me
// createMaintenance(form)
// API call lagegi

}



return (

<div className="
bg-white
rounded-xl
border
p-6
space-y-5
">


<div className="flex justify-between items-center">

<h2 className="
text-xl
font-semibold
text-slate-900
">
Log Service Record
</h2>


<Save size={22}/>

</div>




<form
onSubmit={handleSubmit}
className="space-y-4"
>


<div>

<label className="text-sm text-slate-600">
Vehicle
</label>


<select
name="vehicle"
value={form.vehicle}
onChange={handleChange}
className="w-full rounded-lg border p-2"
>

<option>
Select Vehicle
</option>

<option>
VAN-05
</option>

<option>
TRUCK-11
</option>

</select>


</div>





<div>

<label className="text-sm text-slate-600">
Service Type
</label>


<input
name="service"
value={form.service}
onChange={handleChange}
placeholder="Oil Change"
className="w-full rounded-lg border p-2"
/>

</div>





<div className="
grid
grid-cols-1
sm:grid-cols-2
gap-4
">


<div>

<label className="text-sm text-slate-600">
Cost
</label>


<input
type="number"
name="cost"
value={form.cost}
onChange={handleChange}
placeholder="0"
className="w-full rounded-lg border p-2"
/>


</div>




<div>

<label className="text-sm text-slate-600">
Date
</label>


<input
type="date"
name="date"
value={form.date}
onChange={handleChange}
className="w-full rounded-lg border p-2"
/>


</div>


</div>





<div>

<label className="text-sm text-slate-600">
Status
</label>


<div className="flex gap-3 flex-wrap mt-2">


{
["AVAILABLE","IN SHOP","ACTIVE"].map(status=>(

<button
type="button"
key={status}
onClick={()=>setForm({
...form,
status
})}
className={`
px-4 py-2 rounded-full border text-sm
${
form.status===status
?"bg-blue-600 text-white"
:"bg-white"
}
`}
>

{status}

</button>

))
}



</div>


</div>





<button
className="
w-full
rounded-lg
bg-blue-600
py-3
text-white
font-semibold
hover:bg-blue-700
"
>

Save Record

</button>



</form>



<div className="
rounded-lg
bg-slate-100
p-4
text-sm
text-slate-600
">

Vehicles in shop are automatically removed from dispatch pool.

</div>


</div>

)

}