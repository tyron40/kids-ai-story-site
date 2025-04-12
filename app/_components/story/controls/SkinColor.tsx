import { useState } from "react"

import { UserSelectionHandler } from "./types"

interface SkinColorProps {
  value?: string | null
  userSelection: UserSelectionHandler
}

const OptionList = [
  {
    label: "Light, pale white",
    color: "#ffe7d1",
  },
  {
    label: "White fair",
    color: "#e6bc98",
  },
  {
    label: "Medium, white to olive",
    color: "#d4aa78",
  },
  {
    label: "Moderate brown",
    color: "#C68642",
  },
  {
    label: "Brown",
    color: "#8D5524",
  },
  {
    label: "Very dark brown to black",
    color: "#3b2219",
  },
]

export default function SkinColor({ value, userSelection }: SkinColorProps) {
  const [selectedOption, setSelectedOption] = useState<
    string | null | undefined
  >(value)

  const onUserSelect = (item: { label: string; color: string }) => {
    if (selectedOption === item.label) {
      setSelectedOption(null)
      userSelection({
        fieldName: "skinColor",
        fieldValue: null,
      })
      return
    }

    setSelectedOption(item.label)
    userSelection({
      fieldValue: item?.label,
      fieldName: "skinColor",
    })
  }

  return (
    <div>
      <label className="font-bold text-4xl text-primary">2. Skin Color</label>
      <div className="grid grid-cols-3 gap-5 mt-3">
        {OptionList.map((item) => (
          <div key={item.label} className="flex justify-center">
            <button
              className={`p-1 border-2 rounded-3xl 
                ${
                  selectedOption == item.label
                    ? "border-primary"
                    : "border-transparent"
                }
                `}
              onClick={() => onUserSelect(item)}
            >
              <div
                style={{ backgroundColor: item.color }}
                className="w-[50px] h-[50px] rounded-3xl flex items-center justify-center"
              >
                <span className="hidden">{item.label}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
