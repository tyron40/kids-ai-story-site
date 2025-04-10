import { UserSelectionHandler } from "@/app/_components/story/controls/types"
import { Select, SelectItem } from "@nextui-org/select"
import { ChangeEventHandler, useState } from "react"

const range = Array.from({ length: 10 }, (_, i) => i + 1)

export default function TotalChaptersSelect({
  userSelection,
}: {
  userSelection: UserSelectionHandler
}) {
  const [value, setValue] = useState<string>("")

  const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setValue(e.target.value)
    userSelection({
      fieldName: "totalChapters",
      fieldValue: e.target.value,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <label
        className="font-bold text-4xl text-primary"
        htmlFor="total-chapters"
      >
        6. Total Chapters
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
  )
}
