"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; // I'll need to add this
import { Label } from "@/components/ui/label";

const formSchema = z.object({
    topic: z.string().min(2, {
        message: "Topic must be at least 2 characters.",
    }),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    useTrending: z.boolean().default(false),
});

interface TopicFormProps {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    isLoading: boolean;
}

export function TopicForm({ onSubmit, isLoading }: TopicFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            level: "intermediate",
            useTrending: false,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Next.js App Router" {...field} />
                            </FormControl>
                            <FormDescription>
                                What would you like to write about?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col sm:flex-row gap-6">
                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Target Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="useTrending"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel>Use Trends</FormLabel>
                                <div className="flex items-center space-x-2 h-10">
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <Label>YouTube + GitHub</Label>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Generating Ideas..." : "Generate Post Ideas"}
                </Button>
            </form>
        </Form>
    );
}
