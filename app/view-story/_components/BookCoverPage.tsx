import Image from "next/image";
import React from "react";

const BookCoverPage = React.forwardRef((props: any, ref: any) => {
  return (
    <div ref={ref}>
      <Image src={props.imageUrl} alt="cover" width={500} height={500} />
    </div>
  );
});

export default BookCoverPage;
