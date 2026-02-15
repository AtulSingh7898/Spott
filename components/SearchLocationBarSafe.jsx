"use client"

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, Loader2 } from "lucide-react";
import { State, City } from "country-state-city";
import { format } from "date-fns";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import { getCategoryIcon } from "@/lib/data";

export default function SearchLocationBarSafe() {
  const router = useRouter();
  const ref = useRef(null);
  const debounceRef = useRef(null);

  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  const { mutate: updateLocation } = useConvexMutation(
    api.users.completeOnboarding
  );

  const { data: results, isLoading } = useConvexQuery(
    api.search.searchEvents,
    query.length >= 2 ? { query, limit: 5 } : "skip"
  );

  const states = useMemo(() => State.getStatesOfCountry("IN"), []);

  const cities = useMemo(() => {
    if (!state) return [];
    const s = states.find((x) => x.name === state);
    return s ? City.getCitiesOfState("IN", s.isoCode) : [];
  }, [state, states]);

  useEffect(() => {
    if (currentUser?.location) {
      setState(currentUser.location.state || "");
      setCity(currentUser.location.city || "");
    }
  }, [currentUser]);

  const onChange = (e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(value), 300);
    setShow(value.length >= 2);
  };

  const onEventClick = (slug) => {
    setShow(false);
    setQuery("");
    router.push(`/events/${slug}`);
  };

  const onCitySelect = async (value) => {
    setCity(value);

    if (!state) return;

    await updateLocation({
      location: { city: value, state, country: "India" },
      interests: currentUser?.interests ?? [],
    });

    router.push(`/explore/${createLocationSlug(value, state)}`);
  };

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="flex gap-2 items-center relative w-full">
      {/* SEARCH */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search events..."
          onChange={onChange}
          onFocus={() => query.length >= 2 && setShow(true)}
          className="w-full h-9 pl-10 border rounded-md text-sm"
        />

        {show && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow max-h-80 overflow-y-auto z-50">
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="animate-spin w-5 h-5" />
              </div>
            ) : (
              results?.map((e) => (
                <button
                  key={e._id}
                  onClick={() => onEventClick(e.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  <div className="flex gap-3">
                    <div className="text-xl">
                      {getCategoryIcon(e.category)}
                    </div>
                    <div>
                      <p className="font-medium">{e.title}</p>
                      <div className="text-xs text-gray-500 flex gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(e.startDate, "MMM dd")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {e.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* STATE */}
      <select
        value={state}
        onChange={(e) => {
          setState(e.target.value);
          setCity("");
        }}
        className="h-9 border rounded-md px-2 text-sm"
      >
        <option value="">State</option>
        {states.map((s) => (
          <option key={s.isoCode} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      {/* CITY */}
      <select
        value={city}
        disabled={!state}
        onChange={(e) => onCitySelect(e.target.value)}
        className="h-9 border rounded-md px-2 text-sm"
      >
        <option value="">City</option>
        {cities.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
