"use client";
import { FC } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Heart, Star, MessageCircle, UserCheck, Building2, CheckCircle, ArrowRight } from "lucide-react";
import { useUserProfile } from "@/hooks/app/useUserProfile";

export const DemoDashboard: FC = () => {
  const { user, profile } = useUserProfile();
  
  // Get user names for welcome message
  const userName = user?.first_name || "Couple";
  const partnerName = profile?.partner_first_name || "";
  const welcomeName = partnerName ? `${userName} & ${partnerName}` : userName;

  // Demo data (replace with real data in production)
  const profileCompletion = 70; // percent
  const recommendedVenues = [
    { name: "The Old Manor Barn", location: "Hampshire", id: 1 },
    { name: "Riverside Pavilion", location: "Oxfordshire", id: 2 },
    { name: "The Glasshouse", location: "London", id: 3 },
  ];
  const savedVenues = [
    { name: "The Glasshouse", location: "London", id: 3 },
    { name: "Willow Hall", location: "Surrey", id: 4 },
  ];
  const nextSteps = [
    "Complete your vibe quiz",
    "Add your wedding date",
    "Explore recommended venues",
    "Book a virtual tour",
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold mb-1">Welcome, {welcomeName}!</h2>
        <p className="text-lg text-muted-foreground mb-2">
          Let's make your wedding venue search seamless and enjoyable.
        </p>
      </div>

      {/* Profile Completion & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <UserCheck className="w-5 h-5 text-[#8CA77A]" />
            <CardTitle className="text-base font-semibold">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#8CA77A] h-2 rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{profileCompletion}%</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Complete your profile to get the best recommendations.
            </p>
            <Link href="/app/profile" className="text-sm text-primary underline font-medium">
              Update Profile
            </Link>
          </CardContent>
        </Card>
        {/* Next Steps */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <CheckCircle className="w-5 h-5 text-[#C97A8A]" />
            <CardTitle className="text-base font-semibold">Your Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {nextSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations & Saved Venues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Star className="w-5 h-5 text-[#C97A8A]" />
            <CardTitle className="text-base font-semibold">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendedVenues.map((venue) => (
                <li key={venue.id} className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{venue.name}</span>
                  <span className="text-xs text-muted-foreground">({venue.location})</span>
                  <Link href={`/app/venues/${venue.id}`} className="ml-auto text-primary underline text-xs">
                    View
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/app/recommendations" className="inline-flex items-center gap-1 mt-3 text-sm text-primary underline font-medium">
              See all recommendations <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
        {/* Saved Venues */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Heart className="w-5 h-5 text-[#8CA77A]" />
            <CardTitle className="text-base font-semibold">Saved Venues</CardTitle>
          </CardHeader>
          <CardContent>
            {savedVenues.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't saved any venues yet.</p>
            ) : (
              <ul className="space-y-2">
                {savedVenues.map((venue) => (
                  <li key={venue.id} className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{venue.name}</span>
                    <span className="text-xs text-muted-foreground">({venue.location})</span>
                    <Link href={`/app/venues/${venue.id}`} className="ml-auto text-primary underline text-xs">
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/app/saved" className="inline-flex items-center gap-1 mt-3 text-sm text-primary underline font-medium">
              View all saved venues <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <Link href="/app/venues" className="flex items-center gap-2 text-[#8CA77A] font-semibold text-lg">
              <Building2 className="w-5 h-5" /> Find Venues
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <Link href="/app/chat" className="flex items-center gap-2 text-[#C97A8A] font-semibold text-lg">
              <MessageCircle className="w-5 h-5" /> Chat with AI Assistant
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <Link href="/app/profile" className="flex items-center gap-2 text-[#8CA77A] font-semibold text-lg">
              <UserCheck className="w-5 h-5" /> Edit Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
