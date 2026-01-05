/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import ReactModal from "react-modal";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import calendarMonthSvg from "../assets/calendar_month.svg";
import {
  normalizeCalendarData,
  type MonthObject,
  type Platform,
  type Post,
} from "@/utils/normalizeCalendarData";
import { format } from "date-fns";
import { calendarData } from "@/DataSets/data";
import "./globals.css";

const CalendarModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) => {
  const today = new Date();

  const [activeDate, setActiveDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [filtersTouched, setFiltersTouched] = useState(false);
  const [platformFilters, setPlatformFilters] = useState<
    Record<Platform, boolean>
  >({
    instagram: true,
    facebook: true,
    linkedin: true,
  });

  const triggerLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (showModal) triggerLoading();
  }, [showModal]);

  const handleClose = () => {
    setActiveDate(today);
    setSelectedDate(today);
    setFiltersTouched(false);
    setPlatformFilters({
      instagram: true,
      facebook: true,
      linkedin: true,
    });
    setShowModal(false);
  };

  /** 🔹 normalize dataset */
  const normalizedData = useMemo(
    () => normalizeCalendarData(calendarData as unknown as MonthObject[]),
    []
  );

  /** 🔹 filter dataset only if user interacted */
  const filteredData = useMemo(() => {
    if (!filtersTouched) return normalizedData;

    const result: Record<string, Post[]> = {};

    Object.entries(normalizedData).forEach(([date, posts]) => {
      const filteredPosts = posts.filter(
        (post) => platformFilters[post.platform]
      );
      if (filteredPosts.length) result[date] = filteredPosts;
    });

    return result;
  }, [normalizedData, platformFilters, filtersTouched]);

  /** 🔹 toggle filters */
  const handlePlatformToggle = (platform: Platform) => {
    setFiltersTouched(true);
    setPlatformFilters((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
    triggerLoading();
  };

  return (
    <ReactModal
      isOpen={showModal}
      shouldCloseOnOverlayClick={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "99%",
          height: "99%",
          backgroundColor: "#191919",
          border: "none",
          borderRadius: "10px",
        },
      }}
    >
      <div className="flex justify-end items-center relative">
        <div className="absolute left-1/2 -translate-x-1/2 text-3xl text-white flex items-center">
          <img src={calendarMonthSvg} alt="calendar" className="mr-2" />
          Calendar
        </div>

        <div className="flex items-center">
          {(["instagram", "facebook", "linkedin"] as Platform[]).map(
            (platform) => (
              <div key={platform} className="flex items-center space-x-2 mr-4">
                <Switch
                  checked={platformFilters[platform]}
                  onCheckedChange={() => handlePlatformToggle(platform)}
                  className="h-5 w-9 rounded-full
                  data-[state=checked]:bg-[#9CBCFF]
                  data-[state=unchecked]:bg-zinc-700
                  [&>span]:h-3.5 [&>span]:w-3.5
                  [&>span]:bg-[#4581FF]
                  [&>span]:data-[state=checked]:translate-x-4 cursor-pointer"
                />
                <Label className="text-gray-500 capitalize">{platform}</Label>
              </div>
            )
          )}

          <button
            className="bg-[#4581ff] text-white p-1 text-xs rounded-sm cursor-pointer"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-3rem)] mt-4">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4581FF] border-t-transparent" />
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : (
          <Calendar
            // calendarType="gregory"
            className="calendar-parent h-full"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            onActiveStartDateChange={({ activeStartDate }) => {
              setActiveDate(activeStartDate!);
              setSelectedDate(activeStartDate!);
              triggerLoading();
            }}
            showNeighboringMonth={false}
            view="month"
            prev2Label={null}
            next2Label={null}
            prevLabel="Previous"
            nextLabel="Next"
            tileContent={({ date, view }) => {
              if (view !== "month") return null;

              const key = format(date, "dd-MM-yyyy");
              const posts = filteredData[key];

              if (!posts)
                return <p className="text-gray-400 text-xs mt-2">No Data</p>;

              return (
                <div className="mt-1 flex flex-wrap gap-1 justify-center">
                  {posts.map((post) => (
                    <div
                      key={post.post_id}
                      className="mt-9 w-[85%] h-[80%] bg-[#121316] rounded-sm  card-wrapper"
                    >
                      <div className="px-2 py-2 h-24">
                        <p className="text-[#606060] line-clamp-5 text-xs text-left">
                          {post.caption}
                        </p>
                      </div>
                      <div className="px-2 py-2 h-[calc(100%-6rem)]">
                        <img
                          src={post.image_url}
                          alt={post.platform}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        )}
      </div>
    </ReactModal>
  );
};

export default CalendarModal;
