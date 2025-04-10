"use client"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { useContext, useEffect, useState } from "react"
import { UserDetailContext } from "../_context/UserDetailConext"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { updateUserCredits } from "../_utils/db"

const Options = [
  {
    id: 1,
    price: 1.99,
    credits: 10,
  },
  {
    id: 2,
    price: 2.99,
    credits: 30,
  },
  {
    id: 3,
    price: 5.99,
    credits: 75,
  },
  {
    id: 4,
    price: 9.99,
    credits: 150,
  },
]

export default function BuyCredits() {
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [selectedOption, setSelectedOption] = useState(0)
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const router = useRouter()
  const notify = (msg: string) => toast(msg)
  const notifyError = (msg: string) => toast.error(msg)

  useEffect(() => {
    if (selectedOption != 0) {
      const price = Options[selectedOption - 1].price
      console.log(price)
      setSelectedPrice(price)
    }
  }, [selectedOption])

  const OnPaymentSuccess = async () => {
    const credit = Options[selectedOption]?.credits + userDetail!.credit!

    console.log("InSide Paypal", credit)

    const result = await updateUserCredits(userDetail!.userEmail!, credit)

    if (result) {
      notify("Credit is Added")
      setUserDetail((prev) => ({
        ...prev,
        ["credit"]: credit,
      }))

      router.replace("/dashboard")
    } else {
      notifyError("Server Error")
    }
  }

  return (
    <div className="min-h-screen p-10 md:px-20 lg:px-40 text-center">
      <h2 className="text-4xl font-bold text-primary">Add More Credits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10 items-center justify-center">
        <div>
          {Options.map((option) => (
            <button
              key={option.id}
              className={`p-6 my-3 border bg-primary text-center 
                    rounded-lg text-white cursor-pointer 
                    hover:scale-105 transition-all
                    ${selectedOption == option.id && "bg-black"}
                    `}
              onClick={() => setSelectedOption(option.id)}
            >
              <h2>
                Get {option.credits} Credits= {option.credits} Story
              </h2>
              <h2 className="font-bold text-2xl">${option.price}</h2>
            </button>
          ))}
        </div>
        <div>
          {selectedPrice > 0 && (
            <PayPalButtons
              style={{ layout: "vertical" }}
              disabled={!selectedOption || selectedOption == 0}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onApprove={() => OnPaymentSuccess()}
              onCancel={() => notifyError("Payment canceld")}
              createOrder={(data, actions) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return actions.order.create({
                  purchase_units: [
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      amount: {
                        value: selectedPrice.toFixed(2),
                        currency_code: "USD",
                      },
                    },
                  ],
                })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
