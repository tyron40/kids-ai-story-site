import { Input } from "@nextui-org/input";
import { Button, Image } from "@nextui-org/react";
import React from "react";

function ImageInput({ userSelection }: any) {
  const [image, setImage] = React.useState<string | null>(null);

  const onFilePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      userSelection({
        fieldName: "storyImage",
        fieldValue: file,
      });
    }
  };

  const onFileRemove = () => {
    setImage(null);
    userSelection({
      fieldName: "storyImage",
      fieldValue: null,
    });
  };

  return (
    <div>
      <label htmlFor="story-image" className="font-bold text-4xl text-primary">
        Your image (optional)
      </label>
      <div className="flex flex-col justify-between mt-3 gap-3">
        <Input
          id="story-image"
          type="file"
          accept="image/*"
          size="md"
          className="max-w-md"
          onChange={onFilePick}
        />
        {image && (
          <div className="relative flex justify-center items-center gap-2">
            <Image src={image} height={180} />
            <Button
              color="primary"
              onPress={onFileRemove}
              className="absolute top-0 right-0 z-10"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageInput;
