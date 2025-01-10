import { Select, SelectItem } from "@nextui-org/select";
import React from "react";

const range = Array.from({ length: 10 }, (_, i) => i + 1);

export default function TotalChaptersSelect({ userSelection }: any) {
  const [value, setValue] = React.useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    userSelection({
      fieldName: "totalChapters",
      fieldValue: e.target.value,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <label
        className="font-bold text-4xl text-primary"
        htmlFor="total-chapters"
      >
        5. Total Chapters
      </label>
      <Select
        id="total-chapters"
        className="max-w-xs"
        label="Select total number of chapters"
        selectionMode="single"
        selectedKeys={[value]}
        onChange={onChange}
      >
        {range.map((num) => (
          <SelectItem key={num} textValue={num.toString()}>
            {num}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
