export function getMilestoneAmount(milestone, contractValue) {
  const value = Number(milestone.value) || 0;
  return milestone.basis === "percent"
    ? ((Number(contractValue) || 0) * value) / 100
    : value;
}

export function getMilestoneValidation(milestones = [], contractValue = 0) {
  if (!milestones.length) return { invalid: false, message: "" };

  const allPercent = milestones.every((milestone) => milestone.basis === "percent");
  const allFixed = milestones.every((milestone) => milestone.basis === "fixed");
  const allocatedAmount = milestones.reduce(
    (total, milestone) => total + getMilestoneAmount(milestone, contractValue),
    0,
  );

  if (allPercent) {
    const percentage = milestones.reduce((total, milestone) => total + (Number(milestone.value) || 0), 0);
    return {
      invalid: percentage > 100,
      message: percentage > 100
        ? `Milestone percentages add up to ${percentage}% — adjust before continuing`
        : "",
    };
  }

  if (allFixed) {
    return {
      invalid: allocatedAmount > contractValue,
      message: allocatedAmount > contractValue
        ? "Fixed milestone amounts exceed the total contract value — adjust before continuing"
        : "",
    };
  }

  return {
    invalid: allocatedAmount > contractValue,
    message: allocatedAmount > contractValue
      ? "Combined milestone allocations exceed the total contract value — adjust before continuing"
      : "",
  };
}
