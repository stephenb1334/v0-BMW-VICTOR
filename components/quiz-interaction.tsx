"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"

interface QuizInteractionProps {
  question: string
  options: string[]
  correctAnswerIndex: number
  onCorrect?: (selectedIndex: number) => void
  onIncorrect?: (selectedIndex: number) => void
}

export function QuizInteraction({
  question,
  options,
  correctAnswerIndex,
  onCorrect,
  onIncorrect,
}: QuizInteractionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (selectedOption === null) return

    const correct = selectedOption === correctAnswerIndex
    setIsCorrect(correct)
    setSubmitted(true)

    if (correct && onCorrect) {
      onCorrect(selectedOption)
    } else if (!correct && onIncorrect) {
      onIncorrect(selectedOption)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-maryland-gold/30 bg-white/90">
      <CardHeader className="border-b border-maryland-gold/20">
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
          disabled={submitted}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                submitted && index === correctAnswerIndex
                  ? "bg-maryland-gold/10 border border-maryland-gold"
                  : submitted && index === selectedOption
                    ? "bg-maryland-red/10 border border-maryland-red"
                    : "hover:bg-gray-50"
              }`}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={submitted} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
              {submitted && index === correctAnswerIndex && <CheckCircle2 className="h-5 w-5 text-maryland-gold" />}
              {submitted && index === selectedOption && index !== correctAnswerIndex && (
                <XCircle className="h-5 w-5 text-maryland-red" />
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold"
          >
            Submit Answer
          </Button>
        ) : (
          <div className={`text-sm font-medium ${isCorrect ? "text-maryland-gold" : "text-maryland-red"}`}>
            {isCorrect ? "Correct! Well done." : `Incorrect. The correct answer is: ${options[correctAnswerIndex]}`}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
