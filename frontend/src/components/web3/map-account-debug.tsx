"use client"

import { useTypedApi } from "@reactive-dot/react"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import { useSignerAndAddress } from "@/hooks/use-signer-and-address"
import { Button } from "../ui/button-extended"
import { createInkSdk } from "@polkadot-api/sdk-ink"
import { useClient } from "@reactive-dot/react"

export function MapAccountDebug() {
  const [isLoading, setIsLoading] = useState(false)
  const [isMapped, setIsMapped] = useState<boolean | undefined>(undefined)
  const [isChecking, setIsChecking] = useState(false)
  const api = useTypedApi()
  const client = useClient()
  const { signer, signerAddress } = useSignerAndAddress()

  // Check mapping status
  const checkMapping = useCallback(async () => {
    if (!signerAddress || !client) {
      setIsMapped(undefined)
      return
    }

    setIsChecking(true)
    try {
      const sdk = createInkSdk(client)
      const mapped = await sdk.addressIsMapped(signerAddress)
      setIsMapped(mapped)
      console.log('🗺️ Account mapping status:', { signerAddress, mapped })
    } catch (error) {
      console.error('❌ Failed to check mapping:', error)
      setIsMapped(undefined)
    } finally {
      setIsChecking(false)
    }
  }, [client, signerAddress])

  useEffect(() => {
    checkMapping()
  }, [checkMapping])

  const handleMapAccount = useCallback(async () => {
    if (!api || !signer) return

    setIsLoading(true)

    try {
      const tx = api.tx.Revive.map_account()
        .signAndSubmit(signer)
      
      toast.promise(tx, {
        loading: "Mapping account...",
        success: "Account mapped successfully!",
        error: "Failed to map account. Do you have enough funds?",
      })

      await tx
      // Recheck mapping status after successful mapping
      setTimeout(checkMapping, 1000)
    } catch (error) {
      console.error('❌ Mapping failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [api, signer, checkMapping])

  if (!signerAddress) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">Connect wallet to check mapping status</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Account Mapping Status</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkMapping} 
          isLoading={isChecking}
        >
          Refresh
        </Button>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm">
          <span className="text-muted-foreground">Address:</span> {signerAddress?.slice(0, 8)}...{signerAddress?.slice(-6)}
        </p>
        
        <p className="text-sm">
          <span className="text-muted-foreground">Mapped:</span>{' '}
          {isChecking ? (
            <span className="text-yellow-600">Checking...</span>
          ) : isMapped === true ? (
            <span className="text-green-600">✅ Yes</span>
          ) : isMapped === false ? (
            <span className="text-red-600">❌ No</span>
          ) : (
            <span className="text-gray-600">Unknown</span>
          )}
        </p>

        {isMapped === false && (
          <Button 
            onClick={handleMapAccount} 
            isLoading={isLoading}
            className="w-full mt-3"
          >
            Map Account (~0.001 DOT)
          </Button>
        )}

        {isMapped === true && (
          <p className="text-xs text-green-600 mt-2">
            ✅ Account is mapped and ready for transactions!
          </p>
        )}
      </div>
    </div>
  )
}
