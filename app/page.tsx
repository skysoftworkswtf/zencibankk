import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, CreditCard, Lock, Loader2 } from 'lucide-react'

export default function Component() {
  const [step, setStep] = useState('card-details')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [amount] = useState('100.00 TRY')
  const [threeDSecureCode, setThreeDSecureCode] = useState('')
  const [is3DSecureLoading, setIs3DSecureLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 6000) // Increased to 6 seconds

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (step === '3d-secure') {
      const timer = setTimeout(() => {
        setIs3DSecureLoading(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'card-details') {
      setStep('3d-secure')
      setIs3DSecureLoading(true)
    } else if (step === '3d-secure') {
      setStep('processing')
      setTimeout(() => {
        setStep('success')
        setTimeout(() => {
          // Redirect to main page after 3 seconds
          window.location.href = '/'
        }, 3000)
      }, 2000)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value)
    setExpiryDate(formattedValue)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Loading ZenciBank Ürünleri...</h2>
          <p className="text-muted-foreground">Please wait while we set up the secure payment environment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ZenciBank Ürünleri</CardTitle>
          <CardDescription>Enter your payment details</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col justify-center">
          {step === 'card-details' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input 
                  id="card-number" 
                  placeholder="1234 5678 9012 3456" 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY" 
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (TRY)</Label>
                <Input 
                  id="amount" 
                  value={amount}
                  readOnly
                />
              </div>
              <Button type="submit" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" /> Proceed to 3D Secure
              </Button>
            </form>
          )}
          {step === '3d-secure' && (
            <div className="space-y-4 flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">ZenciBank 3D Secure</h3>
                <p className="text-sm text-muted-foreground">Verifying your payment</p>
              </div>
              {is3DSecureLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                  <p className="text-lg">Sending verification code...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
                  <div className="space-y-2">
                    <Label htmlFor="3d-secure-code">Enter 3D Secure Code</Label>
                    <Input 
                      id="3d-secure-code" 
                      placeholder="Enter code sent to your phone" 
                      value={threeDSecureCode}
                      onChange={(e) => setThreeDSecureCode(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Lock className="mr-2 h-4 w-4" /> Verify and Pay
                  </Button>
                </form>
              )}
            </div>
          )}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Loader2 className="h-24 w-24 text-primary animate-spin mb-6" />
              <p className="text-2xl font-semibold">Processing Payment...</p>
            </div>
          )}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />
              <p className="text-2xl font-semibold mb-2">Payment Successful!</p>
              <p className="text-muted-foreground">Your invoice will be sent by mail.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <p className="text-sm text-muted-foreground">Secure Payment</p>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardFooter>
      </Card>
    </div>
  )
}
