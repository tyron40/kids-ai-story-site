"use client"
import {
  UserSelectionHandler,
  OptionField,
} from "@/app/_components/story/controls/types"
import Image from "next/image"
import { useState } from "react"

const OptionList = [
  {
    label: "Story Book",
    imageUrl: "/story.png",
    isFree: true,
  },
  {
    label: "Bed Story",
    imageUrl: "/bedstory.png",
    isFree: true,
  },
  {
    label: "Educational",
    imageUrl: "/educational.png",
    isFree: true,
  },
]

export default function StoryType({
  userSelection,
}: {
  userSelection: UserSelectionHandler
}) {
  const [selectedOption, setSelectedOption] = useState<string>()

  const onUserSelect = (item: OptionField) => {
    setSelectedOption(item.label)
    userSelection({
      fieldValue: item?.label,
      fieldName: "storyType",
    })
  }

  return (
    <div>
      <label className="font-bold text-4xl text-primary">3. Story Type</label>
      <div className="grid grid-cols-3 gap-5 mt-3">
        {OptionList.map((item) => (
          <button
            key={item.label}
            className={`relative grayscale hover:grayscale-0 cursor-pointer p-1 border-2 rounded-3xl border-primary
                ${
                  selectedOption == item.label
                    ? "grayscale-0"
                    : "grayscale border-transparent"
                }
                `}
            onClick={() => onUserSelect(item)}
          >
            <h2 className="absolute bottom-5 text-2xl text-white text-center w-full">
              {item.label}
            </h2>
            <Image
              src={item.imageUrl}
              alt={item.label}
              width={300}
              height={500}
              className="object-cover h-[260px] rounded-3xl"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
