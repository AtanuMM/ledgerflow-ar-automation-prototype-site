import Field from "../../../components/ui/Field";

function BasicStep({ form, setForm }) {
  const update = (k, v) => setForm({ ...form, [k]: v });
  return <div className="grid gap-5 md:grid-cols-2">
    <div className="md:col-span-2"><Field label="Contract title"><input className="field" value={form.title} onChange={(e) => update("title", e.target.value)} /></Field></div>
    <Field label="Customer"><select className="field" value={form.customer} onChange={(e) => update("customer", e.target.value)}><option>Capital Retail Solutions</option><option>Anandapur Textiles Pvt Ltd</option><option>+ Add a new customer</option></select></Field>
    <Field label="Contract type"><select className="field"><option>New contract</option><option>Addendum</option><option>Renewal</option></select></Field>
    <Field label="Customer country"><select className="field" value={form.country} onChange={(e) => update("country", e.target.value)}><option>India</option><option>Netherlands</option><option>Germany</option><option>Singapore</option><option>USA</option></select></Field>
    {form.country === "India" ? <Field label="Customer state"><select className="field" value={form.state} onChange={(e) => update("state", e.target.value)}><option>Delhi</option><option>West Bengal</option><option>Maharashtra</option><option>Karnataka</option></select></Field> : <Field label="Customer city"><input className="field" placeholder="e.g. Amsterdam" /></Field>}
    <Field label="Billing entity"><select className="field" value={form.entity} onChange={(e) => update("entity", e.target.value)}><option>Matrix Media — India (West Bengal)</option><option>Matrix Media — Singapore</option><option>Matrix Media — USA</option></select></Field>
    <Field label="Effective date"><input className="field" type="date" defaultValue="2026-10-01" /></Field>
    <Field label="Contract end date"><input className="field" type="date" defaultValue="2027-09-30" /></Field>
  </div>;
}
export default BasicStep;
