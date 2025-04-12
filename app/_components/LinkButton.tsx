import Link, { LinkProps } from "next/link"

export default function LinkButton(props: LinkProps & { text: string }) {
  return (
    <Link
      {...props}
      className="text-white bg-primary hover:opacity-90 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none"
    >
      {props.text}
    </Link>
  )
}
