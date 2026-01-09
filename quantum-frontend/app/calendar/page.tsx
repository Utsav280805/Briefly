"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, Video, Plus, Clock, Users } from "lucide-react";
import { mockMeetings } from "@/lib/mock-data";
import { format } from "date-fns";

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <Brain className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Quantum
                            </span>
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link href="/meetings/1" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Meetings
                            </Link>
                            <Link href="/bot-manager" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Bot Manager
                            </Link>
                            <Link href="/tasks" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Tasks
                            </Link>
                            <Link href="/calendar" className="text-sm font-medium text-purple-600">
                                Calendar
                            </Link>
                            <Link href="/analytics/emotion" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Analytics
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                SC
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Smart Calendar</h1>
                        <p className="text-muted-foreground">Meetings and AI-suggested follow-ups</p>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Meeting
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Calendar</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </CardContent>
                    </Card>

                    {/* Meetings List */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Meetings</CardTitle>
                                <CardDescription>Your scheduled meetings for this week</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {mockMeetings.map((meeting) => (
                                    <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                                        <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                <Video className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold mb-1">{meeting.title}</h4>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {format(new Date(meeting.date), "PPp")}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {meeting.participants.length} participants
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {meeting.participants.slice(0, 3).map((participant, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                            {participant}
                                                        </Badge>
                                                    ))}
                                                    {meeting.participants.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{meeting.participants.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        {/* AI Follow-up Suggestions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Follow-up Suggestions</CardTitle>
                                <CardDescription>Smart recommendations based on your meetings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg border bg-purple-500/5 border-purple-500/20">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                            <Brain className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium mb-1">Follow-up: Q1 Product Planning</h4>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                AI suggests scheduling a follow-up in 1 week to review Jira integration progress
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                                                    Schedule
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Dismiss
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                                            <Brain className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium mb-1">Check-in: Sprint Retrospective</h4>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                AI suggests a quick check-in to verify automated testing pipeline setup
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                                                    Schedule
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Dismiss
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Integration Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Calendar Integrations</CardTitle>
                                <CardDescription>Sync with your existing calendars</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-16 justify-start">
                                        <div className="text-left">
                                            <div className="font-semibold">Google Calendar</div>
                                            <div className="text-xs text-muted-foreground">Not connected</div>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="h-16 justify-start">
                                        <div className="text-left">
                                            <div className="font-semibold">Outlook Calendar</div>
                                            <div className="text-xs text-muted-foreground">Not connected</div>
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
