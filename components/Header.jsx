"use client";



import Image from "next/image";
import React, { useState } from 'react'
import Link from "next/link";
import {SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { Building, Crown, Plus, Ticket } from "lucide-react";
import OnboardingModal from "./onboarding-model";
import { useOnboarding } from "@/hooks/use-onboarding";
import SearchLocationBar from "./search-location-bar";
import SearchLocationBarSafe from "./SearchLocationBarSafe";
import { Badge } from "./ui/badge";
import UpgradeModal from "./upgrad-model";



const Header = () => {
  const [showUpgradModal, setShowUpgradModal] = useState(false)
  const {isLoading} = useStoreUser();
  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } =
  useOnboarding();
  const {has} = useAuth();
  const hasPro = has?.({ plan: "pro" });
  console.log("showOnboarding:", showOnboarding);

 
  return (
    <>
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* logo */}
          <Link href={"/"} className="flex items-center">
          {/* <Image src='/spott.png' /> */}

          <Image
              src="/spott.png"
              alt="Spott logo"
              width={500}
              height={500}
              className="w-full h-11"
              priority
            />
             {hasPro && (
              <Badge className="bg-linear-to-r from-pink-500 to-orange-500 gap-1 text-white ml-3">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}
            </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <SearchLocationBar />
            {/* <SearchLocationBarSafe /> */}
          </div>


            <div className="flex items-center">
            {!hasPro && <Button variant={"ghost"} 
            size="sm" 
            onClick={() => setShowUpgradModal(true)}>
              Pricing
            </Button>}

            <Button variant="ghost" size="sm" asChild className={"mr-3"}>
              <Link href="/explore">Explore</Link>
            </Button>
            
            <Authenticated >
              {/* Create-Events  */}
              <Button size="sm" asChild className="flex gap-2 mr-4">
                <Link href="/create-event">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </Link>
              </Button>
                <a href="" className="px-2"></a>
              <UserButton>
                <UserButton.MenuItems>
                <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={16} />}
                    href="/my-events"
                  />
                <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size="sm">Sign-In</Button>
              </SignInButton>
            </Unauthenticated>
            </div>
        </div>
        {/* mobile serach */}
        <div className="md:hidden border-t px-3 py-3 ">
            {/* <SearchLocationBarSafe  /> */}
            <SearchLocationBar />
          </div>

        {/* Loader  */}
        {isLoading && (<div className="absolute bottom-0 left-0 w-full">
          <BarLoader width={"100%"} color="#a855f7"/>
        </div>) }
    </nav>
    {/* Oboarding Model  */}
    {/* <OnboardingModel 
    isOpen={showOnboarding}
    onClose={handleOnboardingSkip}
    onComplete={handleOnboardingComplete}
    /> */}
    <OnboardingModal
    isOpen={showOnboarding}
    onClose={handleOnboardingSkip}
    onComplete={handleOnboardingComplete}
    />
    
    <UpgradeModal
        isOpen={showUpgradModal}
        onClose={() => setShowUpgradModal(false)}
        trigger="Header"
      />
    
    </>
  )
}

export default Header