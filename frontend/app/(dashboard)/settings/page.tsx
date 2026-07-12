import GeneralSettings from "@/components/settings/general-settings";
import RbacTable from "@/components/settings/rbac-table";
import SettingsActions from "@/components/settings/settings-actions";

import {getSettings} from "@/services/settings.service";


export default async function SettingsPage(){


const settings = await getSettings();



return (

<div className="space-y-6">


<div>

<h1 className="
text-3xl
font-bold
">

System Settings

</h1>


<p className="text-slate-500">
Configure fleet operations and manage permissions.
</p>


</div>





<div className="
grid
grid-cols-1
lg:grid-cols-3
gap-6
">


<div>

<GeneralSettings data={settings}/>

</div>




<div className="
lg:col-span-2
">

<RbacTable
roles={settings.roles}
/>


</div>



</div>




<SettingsActions/>


</div>


)

}