

function Avatar({ name, size = "md" }) {
  const letters = name.split(" ").map((x) => x[0]).slice(0, 2).join("");
  return <div className={`${size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"} grid shrink-0 place-items-center rounded-xl bg-moss-100 font-bold text-moss-700`}>{letters}</div>;
}
export default Avatar;
