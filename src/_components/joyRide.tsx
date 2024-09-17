"use client"
import { CallBackProps, STATUS, Step, } from "react-joyride";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FcIdea } from "react-icons/fc";
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react";
import { usePathname, } from "next/navigation";
import { Session } from "next-auth";


export default function HighJoyRide() {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState<Step[]>([]);
    const session = useSession()
    const pathname = usePathname()

    const getSteps = (pathname: string, data: Session | null): Step[] => {
        if (!data) {
            return [
                {
                    target: ".createTableBtn",
                    title: <h1 className="font-semibold text-lg">Welcome to Attendance tracking!</h1>,
                    content: "We're glad you chose us! You can create a table for your academic schedule, add your subjects, and track your attendance. However, you first need to log in to access all the features we offer.",
                    spotlightClicks: true,
                    locale: { last: "Completed" },
                    spotlightPadding: 15,
                    disableBeacon: true,
                },
            ];
        }

        switch (pathname) {
            case "/":
                return [
                    {
                        target: ".createTableBtn",
                        title: <h1 className="font-semibold text-lg">Congratulations 🎉</h1>,
                        content: "Congratulations for taking the first step! Now you can create your first attendance table, or use one copy one from other students",
                        spotlightClicks: true,
                        spotlightPadding: 15,
                        disableBeacon: true,
                    },
                    {
                        target: ".libraryBtn",
                        title: <h1 className="font-semibold text-lg">Library 📚</h1>,
                        content: "Here you can find all attendance tables created by others, use can see them or copy them",
                        spotlightClicks: true,
                    },
                    {
                        target: ".avatarBtn",
                        title: <h1 className="font-semibold text-lg">Menu 📌</h1>,
                        content: "This is an extendable menu. Click for more options.",
                        spotlightClicks: true,
                        locale: { last: "Completed" },
                    },
                ];
            case `/${data.user.id}`:
                return [
                    {
                        target: ".profileOptions",
                        title: <h1 className="font-semibold text-lg">Profile Options</h1>,
                        content: "You can create a new attendance table or edit your info here.",
                        spotlightClicks: true,
                        disableBeacon: true,
                    },
                    {
                        target: ".verifyEmail",
                        title: <h1 className="font-semibold text-lg">Verify Email 📧</h1>,
                        content: "Click here to verify your email.",
                        spotlightClicks: true,

                    },
                    {
                        target: ".tablesPlace",
                        title: <h1 className="font-semibold text-lg">Attendance Tables 📅</h1>,
                        content: "After you create a table you will find it here and you can view, edit or delete it.",
                        spotlightClicks: true,
                    },
                ];
            case "/students":
                return [
                    {
                        target: ".searchStudents",
                        title: <h1 className="font-semibold text-lg">Search Students 🔍</h1>,
                        content: "Search for students by name or email.",
                        spotlightClicks: true,
                        disableBeacon: true,
                    },
                    {
                        target: ".viewStudent",
                        title: <h1 className="font-semibold text-lg">Student Profile 🎓</h1>,
                        content: "View student profiles and their attendance tables.",
                        spotlightClicks: true,
                    },
                ];
            default:
                if (pathname.includes("create-table")) {
                    return [
                        {
                            target: ".tableName",
                            title: <h1 className="font-semibold text-lg">
                                Table Name 📝
                            </h1>,
                            content: "Enter a name for your attendance table.",
                            spotlightClicks: true,
                            disableBeacon: true,
                        },
                        {
                            target: ".publicSwitch",
                            title: <h1 className="font-semibold text-lg">
                                Public Table 🔓
                            </h1>,
                            content: "Toggle this switch to make your table public or private.",
                            spotlightClicks: true,
                        },
                        {
                            target: ".subjectName",
                            title: <h1 className="font-semibold text-lg">
                                Subject Name 📚
                            </h1>,
                            content: "Enter the subject name for this table.",
                            spotlightClicks: true,
                        },
                        {
                            target: ".startsAt",
                            title: <h1 className="font-semibold text-lg">
                                Start Time 🕒
                            </h1>,
                            content: "Enter the start time for this subject.",
                            spotlightClicks: true,
                        },
                        {
                            target: ".endsAt",
                            title: <h1 className="font-semibold text-lg">
                                End Time 🕒
                            </h1>,
                            content: "Enter the end time for this subject.",
                            spotlightClicks: true,
                        },
                        {
                            target: ".teacherName",
                            title: <h1 className="font-semibold text-lg">
                                Teacher Name 👨‍🏫
                            </h1>,
                            content: "Enter the teacher name for this subject.",
                            spotlightClicks: true,
                        },
                        {
                            target: ".deleteSubject",
                            title: <h1 className="font-semibold text-lg">
                                Delete Subject ❌
                            </h1>,
                            content: "Click here to delete this subject.",
                            spotlightClicks: true,
                        },
                        {
                            target: ".addSubject",
                            title: <h1 className="font-semibold text-lg">
                                Add Subject ➕
                            </h1>,
                            content: "Click here to add a new subject.",
                            spotlightClicks: true,
                        },
                        {
                            target: ".createTable",
                            title: <h1 className="font-semibold text-lg">
                                Create Table 🚀
                            </h1>,
                            content: "Click here to create the attendance table.",
                            spotlightClicks: true,
                            locale: { last: "Completed" },
                        }
                    ];
                }
                return [];
        }
    };



    useEffect(() => {
        const steps = getSteps(pathname, session.data ?? null);
        setSteps(steps);
    }, [pathname, session.data]);


    return (
        <>
            <JoyRide
                steps={steps}
                run={run}
                setRun={setRun} />
            <div className="group absolute top-28 sm:top-40 left-8 flex items-center">
                <Button
                    size={"icon"}
                    variant={"ghost"}
                    className=" -rotate-[20deg] hover:bg-transparent hover:shadow-none hover:cursor-pointer"
                    onClick={() => setRun(true)}>
                    <FcIdea size={30} />
                </Button>
                <span className="duration-700 ease-in-out opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-4 will-change">
                    Show me around
                </span>
            </div>
        </>
    )
}


type JoyRideProps = {
    steps: Step[]
    run: boolean
    setRun: React.Dispatch<React.SetStateAction<boolean>>
}
const JoyRideSSR = dynamic(() => import("react-joyride"), { ssr: false })

const JoyRide = ({ steps, run, setRun }: JoyRideProps) => {

    const handleJoyride = (data: CallBackProps) => {
        const { status, } = data
        if (status.includes(STATUS.FINISHED) || status.includes(STATUS.SKIPPED)) {
            setRun(false);
        }
    }

    return (
        <JoyRideSSR
            steps={steps}
            run={run}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            callback={handleJoyride}
            styles={{
                options: {
                    arrowColor: "hsl(251, 100%, 55%)",
                    backgroundColor: "#fff",
                    overlayColor: "rgba(0,0,0,0.8)",
                    primaryColor: "hsl(251, 100%, 55%)",
                    textColor: "#000",
                },
            }}
        />
    )
}