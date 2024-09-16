import { useFormContext, useFieldArray } from "react-hook-form";
import { SubjectForm } from "./subjectForm";
import { Button } from "@/_components/ui/button";

type SubjectFieldProps = {
    day: string
}

export default function SubjectField({ day }: SubjectFieldProps) {
    const { control } = useFormContext();

    const { fields, remove, append } = useFieldArray({
        control,
        name: `days.${day}.subjects`,
    });



    function removeSubject(index: number) {
        remove(index);
    }

    function appendSubject() {
        append({
            name: "",
            teacher: "",
            startTime: "08:00 AM",
            endTime: "09:00 AM",
            attendance: 0,
            absence: 0,
        });
    }

    return (
        <>
            {fields.map((field, index) => (
                <SubjectForm
                    key={field.id}
                    index={index}
                    name={`days.${day}.subjects`}
                    onRemove={removeSubject}
                />
            ))}
            <Button
                type="button"
                onClick={appendSubject}
                className="col-span-2 sm:col-span-1 w-full sm:w-fit bg-brand-300 hover:bg-brand-300 dark:bg-navy-600 dark:hover:bg-navy-700 text-white place-self-end addSubject">
                Add Subject
            </Button>
        </>
    );
}
