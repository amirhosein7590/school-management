import useTableStore from "@/store/tableStore";
import { Button } from "./button";

export default function SelectAction() {
  const selected = useTableStore((s) => s.selected);
  const selectedRows = Object.values(selected).filter((s) => s);
  if (selectedRows.length < 2) return;

  return (
    <Button size="sm" className="rounded-sm" onClick={() => console.log(selected)} variant="destructive">
      حذف همه
    </Button>
  );
}
