import React, { useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEventRegistrants, useEventFeedbacks } from "../queries";
import { Loader2, User as UserIcon, MessageSquare } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface EventDetail {
  id: string;
  title: string;
  date: string;
}

interface MemberData {
  user_id: string;
  name: string;
  email: string;
  unique_number: string;
  attend: boolean;
  duration: number | null;
  suggestion: string | null;
  material_quality: number | null;
  delivery_quality: number | null;
}

interface EventItem {
  detail_event: EventDetail;
  members: MemberData[];
}

interface EventRegistrantsResponse {
  event_name: string;
  status_event: string;
  registrants: EventItem[];
}

interface EventFeedbacksResponse {
  event_name: string;
  status_event: string;
  feedbacks: EventItem[];
}

interface EventDataPageProps {
  onBack?: () => void;
}

export function EventDataPage({ onBack }: EventDataPageProps) {
  const { event_id } = useParams({
    from: "/_dashboard/event-data/$event_id",
  }) as { event_id: string };

  const event_registrants_query = useEventRegistrants(event_id);
  const event_feedbacks_query = useEventFeedbacks(event_id);

  const registrants = useMemo(() => {
    const data = event_registrants_query.data as
      | EventRegistrantsResponse
      | undefined;
    if (!data?.registrants) return [];
    return data.registrants.flatMap((reg) => reg.members);
  }, [event_registrants_query.data]);

  const feedbacks = useMemo(() => {
    const data = event_feedbacks_query.data as
      | EventFeedbacksResponse
      | undefined;
    if (!data?.feedbacks) return [];
    return data.feedbacks.flatMap((item) => item.members);
  }, [event_feedbacks_query.data]);

  const isLoading =
    event_registrants_query.isLoading || event_feedbacks_query.isLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading event data...</p>
      </div>
    );
  }

  const eventName = (() => {
    const rData = event_registrants_query.data;
    if (
      rData &&
      !Array.isArray(rData) &&
      typeof rData === "object" &&
      "event_name" in (rData as any)
    ) {
      return (rData as EventRegistrantsResponse).event_name;
    }

    const fData = event_feedbacks_query.data;
    if (
      fData &&
      !Array.isArray(fData) &&
      typeof fData === "object" &&
      "event_name" in (fData as any)
    ) {
      return (fData as EventFeedbacksResponse).event_name;
    }

    return "Event Details";
  })();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="mb-6 border-b pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            {eventName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detail data untuk Event ID: **{event_id}**
          </p>
        </div>
        <Button
          onClick={() => {
            if (onBack) return onBack();
            if (typeof window !== "undefined") window.history.back();
          }}
          size="sm"
          variant="outline"
        >
          Back
        </Button>
      </header>

      <Tabs defaultValue="registrants" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 mb-4 bg-muted/40">
          <TabsTrigger
            value="registrants"
            className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Registrants
            <Badge variant="secondary" className="ml-2 h-5">
              {registrants.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="feedbacks"
            className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedbacks
            <Badge variant="secondary" className="ml-2 h-5">
              {feedbacks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="registrants"
          className="p-4 border rounded-lg bg-white shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Daftar Anggota Terdaftar
          </h3>

          {registrants.length > 0 ? (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {registrants.map((registrant) => (
                <div
                  key={registrant.user_id}
                  className="p-3 border rounded-md hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {registrant.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {registrant.email} | {registrant.unique_number}
                    </p>
                  </div>
                  {registrant.attend ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Attended
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Did Not Attend</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground italic">
              No registrants found for this event.
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="feedbacks"
          className="p-4 border rounded-lg bg-white shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Ulasan & Saran Anggota
          </h3>

          {feedbacks.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {feedbacks.map((feedback, index) => (
                <div
                  key={feedback.user_id || index}
                  className="border p-4 rounded-md shadow-sm"
                >
                  <p className="font-bold text-primary">
                    {feedback.name || "Anonim"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feedback.email}
                  </p>

                  <div className="text-sm text-gray-700 mb-3 border-l-4 border-primary-400 pl-3 italic">
                    {feedback.suggestion ||
                      "Tidak ada komentar/saran yang diberikan."}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-medium pt-2 border-t mt-3 text-gray-600">
                    <span>
                      Kualitas Materi:
                      <Badge variant="outline" className="ml-1 bg-gray-100">
                        {feedback.material_quality || "-"}
                      </Badge>
                    </span>
                    <span>
                      Kualitas Penyampaian:
                      <Badge variant="outline" className="ml-1 bg-gray-100">
                        {feedback.delivery_quality || "-"}
                      </Badge>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground italic">
              No feedbacks found for this event.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
