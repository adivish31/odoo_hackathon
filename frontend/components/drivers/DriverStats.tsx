export default function DriverStats(){

const stats=[
{
title:"Total Drivers",
value:"128",
icon:"👥"
},
{
title:"On Duty",
value:"94",
icon:"✅"
},
{
title:"Expired Licenses",
value:"03",
icon:"⚠️"
},
{
title:"Avg Safety Score",
value:"92/100",
icon:"🛡️"
}
];


return(

<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

{
stats.map((item)=>(

<div
key={item.title}
className="bg-white border rounded-lg p-5 flex gap-4 items-center"
>

<div className="text-3xl">
{item.icon}
</div>

<div>
<p className="text-sm text-slate-500">
{item.title}
</p>

<h2 className="text-xl font-bold">
{item.value}
</h2>

</div>


</div>

))
}

</div>

)

}