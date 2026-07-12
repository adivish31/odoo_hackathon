import { MaintenanceKPI } from "@/types/maintenance";
import {
  CreditCard,
  Factory,
  AlertTriangle
} from "lucide-react";


const icons:any={
 payments:CreditCard,
 precision_manufacturing:Factory,
 warning:AlertTriangle
};



export default function MaintenanceKPI({
data
}:{
data:MaintenanceKPI[]
}){


return(

<div className="
grid
grid-cols-1
sm:grid-cols-3
gap-4
">


{
data.map((item)=>(

<KPI
key={item.title}
item={item}
/>

))
}


</div>


)

}



function KPI({
item
}:{
item:MaintenanceKPI
}){


const Icon=icons[item.icon] || CreditCard;


return(

<div className="
bg-white
border
rounded-xl
p-5
flex
justify-between
items-center
">


<div>

<p className="
text-xs
text-slate-500
uppercase
">
{item.title}
</p>


<h3 className="
text-2xl
font-bold
mt-2
">
{item.value}
</h3>


</div>


<Icon
size={38}
className="text-blue-600 opacity-30"
/>


</div>

)

}