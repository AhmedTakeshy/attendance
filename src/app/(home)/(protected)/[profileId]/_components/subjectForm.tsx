import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/_components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/popover";
import { Button } from "@/_components/ui/button";

type SubjectFormProps = {
    index: number;
    name: string;
    onRemove: (index: number) => void;
}

export function SubjectForm({ index, name, onRemove }: SubjectFormProps) {
    const { control } = useFormContext();
    const hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const minutes = ["00", "15", "30", "45"];
    const periods = ["AM", "PM"];

    return (
        <div className=' flex flex-col sm:flex-row sm:items-baseline items-center justify-start w-full gap-6'>
            <FormField control={control} name={`${name}[${index}].name`}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Subject name..."
                                className="hover:bg-white sm:w-auto dark:bg-navy-800 dark:shadow-navy-400 placeholder:text-base subjectName"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}>
            </FormField>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="dark:bg-navy-700 startsAt">
                        Starts at
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-3 gap-4 dark:bg-navy-800">
                    <FormField
                        control={control}
                        name={`${name}[${index}].startTime.hour`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder="Hour"
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((hour) => (
                                                <SelectItem key={hour} value={hour}>
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField control={control} name={`${name}[${index}].startTime.minute`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder="Minute"
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((minute) => (
                                                <SelectItem key={minute} value={minute}>
                                                    {minute}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField control={control} name={`${name}[${index}].startTime.period`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder="Period"
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem key={period} value={period}>
                                                    {period}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="dark:bg-navy-700 endsAt">
                        Ends at
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-3 gap-4 dark:bg-navy-800">
                    <FormField control={control} name={`${name}[${index}].endTime.hour`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder="Hour"
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((hour) => (
                                                <SelectItem key={hour} value={hour}>
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField control={control} name={`${name}[${index}].endTime.minute`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder="Minute"
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((minute) => (
                                                <SelectItem key={minute} value={minute}>
                                                    {minute}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField control={control} name={`${name}[${index}].endTime.period`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder="Period"
                                                onBlur={field.onBlur}
                                                ref={field.ref}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem key={period} value={period}>
                                                    {period}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                </PopoverContent>
            </Popover>
            <FormField control={control} name={`${name}[${index}].teacher`}
                render={({ field }) => (
                    <FormItem className='sm:basis-52'>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Teacher name (optional)"
                                className="hover:bg-white sm:w-auto dark:bg-navy-800 dark:shadow-navy-400 placeholder:text-base teacherName"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}>
            </FormField>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="dark:bg-navy-700 ">
                        Attendance
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="dark:bg-navy-800">
                    <FormField control={control} name={`${name}[${index}].attendance`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="number"
                                        pattern="[0-9]*"
                                        placeholder="Attendance"
                                        className="hover:bg-white dark:bg-navy-800 dark:shadow-navy-400 placeholder:text-base attendanceNumber"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                </PopoverContent>
            </Popover>
            <Button variant={"destructive"} onClick={() => onRemove(index)} className="sm:ml-auto deleteSubject">
                Delete Subject
            </Button>
        </div>
    )
}
