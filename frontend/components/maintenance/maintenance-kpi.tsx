import type { ElementType } from "react";
import type { MaintenanceKPI } from "@/types/maintenance";
import {
  CreditCard,
  Factory,
  AlertTriangle
} from "lucide-react";


const icons: Record<string, ElementType> = {
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
bg-panel
border
border-hairline
rounded-[10px]
p-5
flex
justify-between
items-center
">


<div>

<p className="
text-[0.75rem]
text-ink-dim
uppercase
font-semibold
tracking-[0.08em]
">
{item.title}
</p>


<h3 className="
text-3xl
font-bold
font-heading
text-ink
mt-2
">
{item.value}
</h3>


</div>


<Icon
size={38}
className="text-reflect opacity-30"
/>


</div>

)

}