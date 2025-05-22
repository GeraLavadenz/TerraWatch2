import { Terminal } from "lucide-react"
import React from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertSection() {
  return (
    <div className="fixed top-16 right-0 w-60 p-4 h-full bg-white dark:bg-[#1a1a1a] border-l border-gray-300 dark:border-gray-700 shadow-md">
    <h1 className="text-xl font-semibold mb-4">Alertas</h1>
    <div>
    <h2>Lluvia</h2>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    </div>
    <div>
      <h2>Hemedad de la Tierra</h2>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    </div>
    </div>
  )
}
