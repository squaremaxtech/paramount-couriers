"use client"

import { ensureCanAccessTable } from "@/serverFunctions/handleAuth";
import { consoleAndToastError } from "@/useful/consoleErrorWithToast";
import toast from "react-hot-toast";

export default function Home() {

  return (
    <div>
      <button
        onClick={() => {
          try {
            toast.success("clicked")

            ensureCanAccessTable({ name: "packages" }, "c")

          } catch (error) {
            consoleAndToastError(error)
          }
        }}
      >click</button>
    </div>
  );
}