"use client";

import { Calendar, MapPin, Users, Trash2, X, QrCode, Eye } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid",
  action = null,
  className = "",
}) {
  if (!event) return null;
  

  return (
    <Card
      className={`overflow-hidden group pt-0 ${
        onClick
          ? "cursor-pointer hover:shadow-lg transition-all hover:border-purple-500/50"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ backgroundColor: event.themeColor }}
          >
            {getCategoryIcon(event.category)}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">
            {event.ticketType === "free" ? "Free" : "Paid"}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3">
        <div>
          <Badge variant="outline" className="mb-2">
            {getCategoryIcon(event.category)}{" "}
            {getCategoryLabel(event.category)}
          </Badge>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
            {event.title}
          </h3>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(event.startDate), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {event.locationType === "online"
                ? "Online Event"
                : `${event.city}, ${event.state || event.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event.registrationCount} / {event.capacity} registered
            </span>
          </div>
        </div>

        {action && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              {action === "event" ? (
                <>
                  <Eye className="w-4 h-4" /> View
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" /> Show Ticket
                </>
              )}
            </Button>

            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                {action === "event" ? (
                  <Trash2 className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
