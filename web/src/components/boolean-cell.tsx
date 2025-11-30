interface BooleanCellProps {
  value: boolean | null | undefined;
}

export const BooleanCell = ({ value }: BooleanCellProps) => {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }
  
  return value ? "Yes" : "No";
};