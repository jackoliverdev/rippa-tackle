"use client";
import { Award, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export function LoyaltyPoints() {
  const [points, setPoints] = useState(236); // Example points value
  
  // Calculate next reward threshold
  const nextRewardThreshold = points < 100 ? 100 : 
                              points < 200 ? 200 :
                              points < 400 ? 400 : 1000;
  
  // Calculate progress percentage towards next reward
  const progressPercentage = points < 100 ? (points / 100) * 100 :
                            points < 200 ? ((points - 100) / 100) * 100 :
                            points < 400 ? ((points - 200) / 200) * 100 :
                            ((points - 400) / 600) * 100;
  
  // Calculate available rewards
  const availableRewards = {
    "£5": Math.floor(points / 100),
    "£10": Math.floor(points / 200),
    "£20": Math.floor(points / 400),
    "£50": Math.floor(points / 1000)
  };

  // Find highest available reward
  const highestAvailableReward = 
    availableRewards["£50"] > 0 ? "£50" :
    availableRewards["£20"] > 0 ? "£20" :
    availableRewards["£10"] > 0 ? "£10" :
    availableRewards["£5"] > 0 ? "£5" : null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Award className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-blue-800">Loyalty Points</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-amber-500 mr-2" />
            <span className="font-bold text-2xl">{points}</span>
            <span className="text-gray-500 ml-2">points</span>
          </div>
          {highestAvailableReward && (
            <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {availableRewards[highestAvailableReward]} x {highestAvailableReward} available
            </div>
          )}
        </div>
        
        <div className="mb-1">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to next reward</span>
            <span>{points} / {nextRewardThreshold}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Earn 1 point for every £1 spent on tackle
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="font-medium">100 points</span>
          </div>
          <span className="font-bold">£5 voucher</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="font-medium">200 points</span>
          </div>
          <span className="font-bold">£10 voucher</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="font-medium">400 points</span>
          </div>
          <span className="font-bold">£20 voucher</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="font-medium">1000 points</span>
          </div>
          <span className="font-bold">£50 voucher</span>
        </div>
      </div>
      
      {highestAvailableReward && (
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
          <Gift className="h-4 w-4 mr-2" />
          Redeem {highestAvailableReward} Voucher
        </Button>
      )}
    </div>
  );
} 