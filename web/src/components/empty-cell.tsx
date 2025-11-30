interface EmptyCellProps {
  value: any;
}

export const EmptyCell = ({ value }: EmptyCellProps) => {
  const isEmpty = value === undefined || value === null || value === "";

  return isEmpty ? <span className="text-muted-foreground">—</span> : value;
};
