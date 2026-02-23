"use client";

import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

const formSchema = z.object({
    topic: z.string().min(2, {
        message: "Topic must be at least 2 characters.",
    }),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    useTrending: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface TopicFormProps {
    onSubmit: (values: FormValues) => void;
    isLoading: boolean;
}

const STORAGE_KEYS = {
    TOPIC: "lgc:defaultTopic",
    LEVEL: "lgc:defaultLevel",
    TRENDING: "lgc:useTrending",
} as const;

export function TopicForm({ onSubmit, isLoading }: TopicFormProps) {
    const { trendsEnabled } = useFeatureFlags();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            level: "intermediate",
            useTrending: false,
        },
    });

    const { setValue, watch, handleSubmit, control } = form;

    useEffect(() => {
        const savedTopic = localStorage.getItem(STORAGE_KEYS.TOPIC);
        const savedLevel = localStorage.getItem(STORAGE_KEYS.LEVEL) as any;
        const savedTrending = localStorage.getItem(STORAGE_KEYS.TRENDING);

        if (savedTopic) setValue("topic", savedTopic);
        if (savedLevel && ["beginner", "intermediate", "advanced"].includes(savedLevel)) {
            setValue("level", savedLevel);
        }
        if (savedTrending) setValue("useTrending", savedTrending === "true");
    }, [setValue]);

    const watchedValues = watch();
    useEffect(() => {
        if (watchedValues.topic) localStorage.setItem(STORAGE_KEYS.TOPIC, watchedValues.topic);
        if (watchedValues.level) localStorage.setItem(STORAGE_KEYS.LEVEL, watchedValues.level);
        localStorage.setItem(STORAGE_KEYS.TRENDING, String(watchedValues.useTrending));
    }, [watchedValues.topic, watchedValues.level, watchedValues.useTrending]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={control}
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
                        control={control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Target Level</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
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
                    {trendsEnabled && (
                        <FormField
                            control={control}
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
                    )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Post Ideas"
                    )}
                </Button>
            </form>
        </Form>
    );
}
