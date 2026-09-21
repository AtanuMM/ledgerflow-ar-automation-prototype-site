import { useState } from "react";
import { Plus } from "lucide-react";
import ActionMenu from "../components/ui/ActionMenu";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import PageHead from "../components/ui/PageHead";

function UsersPage({ notify }) {
  const [users, setUsers] = useState([["Atanu Dey","atanu@matrixmedia.com","Admin"],["Neha Kapoor","neha@matrixmedia.com","Finance / Ops"],["Rahul Sen","rahul@matrixmedia.com","Approver"],["Maya Das","maya@matrixmedia.com","Finance / Ops"]]);
  const deleteUser = (user) => {
    setUsers((items) => items.filter((item) => item[1] !== user[1]));
    notify(`${user[0]} removed`);
  };
  return <><PageHead eyebrow="Access management" title="Users & roles" desc="Manage who can create, approve and configure your AR workspace." action={<button onClick={()=>notify("Demo user added")} className="btn-primary"><Plus size={16}/>Add user</button>}/><div className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead className="bg-slate-50"><tr>{["User","Email","Role","Status",""].map((x)=><th key={x} className="table-head">{x}</th>)}</tr></thead><tbody>{users.map((u)=><tr key={u[1]}><td className="table-cell"><div className="flex items-center gap-3"><Avatar name={u[0]} size="sm"/><b>{u[0]}</b></div></td><td className="table-cell text-slate-500">{u[1]}</td><td className="table-cell"><select className="rounded-lg border bg-white px-3 py-2 text-sm"><option>{u[2]}</option><option>Admin</option><option>Finance / Ops</option><option>Approver</option></select></td><td className="table-cell"><Badge>Active</Badge></td><td className="table-cell"><ActionMenu onEdit={()=>notify(`Editing ${u[0]}`)} onDelete={()=>deleteUser(u)}/></td></tr>)}</tbody></table></div></div></>;
}
export default UsersPage;
