"use client";
import { CBPayInstanceType, initOnRamp } from "@coinbase/cbpay-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const PayWithCoinbaseButton = ({ smartWalletAddress, disabled }: any) => {
  const [onrampInstance, setOnrampInstance] = useState<CBPayInstanceType | null>();

  useEffect(() => {
    initOnRamp({
      appId: "aff0ca57-758c-416b-8844-03b0abbecec1",
      widgetParameters: {
        // Specify the addresses and which networks they support
        addresses: { [smartWalletAddress]: ["base"]},
        // Filter the available assets on the above networks to just these ones
        assets: ['ETH','USDC'],
      },
      onSuccess: () => {
        alert("Success! Check your balance");
        console.log('success');
      },
      onExit: () => {
        console.log('exit');
      },
      onEvent: (event) => {
        console.log('event', event);
      },
      experienceLoggedIn: 'popup',
      experienceLoggedOut: 'popup',
      closeOnExit: true,
      closeOnSuccess: true,
    }, (_, instance) => {
      setOnrampInstance(instance);
    });

    // When button unmounts destroy the instance
    return () => {
      onrampInstance?.destroy();
    };
  }, []);

  const handleClick = () => {
    onrampInstance?.open();
  };

  return <Button onClick={handleClick} disabled={!onrampInstance || disabled}>Buy with Coinbase</Button>;
};