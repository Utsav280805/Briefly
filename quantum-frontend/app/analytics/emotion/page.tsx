"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, Download, TrendingUp, Smile, Frown, Meh } from "lucide-react";
import { mockMeetings } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const emotionColors = {
    happy: "#10b981",
    neutral: "#6b7280",
    concerned: "#f59e0b",
    frustrated: "#ef4444",
};

export default function EmotionAnalyticsPage() {
    const meeting = mockMeetings[0];
    const emotionData = meeting.emotionData;

    // Prepare data for charts
    const speakerEmotionData = Object.entries(emotionData.speakerEmotions).map(([speaker, emotions]) => ({
        speaker: speaker.split(" ")[0],
        ...emotions,
    }));

    const emotionDistribution = [
        { name: "Happy", value: 65, color: emotionColors.happy },
        { name: "Neutral", value: 25, color: emotionColors.neutral },
        { name: "Concerned", value: 8, color: emotionColors.concerned },
        { name: "Frustrated", value: 2, color: emotionColors.frustrated },
    ];

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
                            <Link href="/calendar" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Calendar
                            </Link>
                            <Link href="/analytics/emotion" className="text-sm font-medium text-purple-600">
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
                        <h1 className="text-3xl font-bold mb-2">Emotion Analytics</h1>
                        <p className="text-muted-foreground">Understand sentiment and engagement in your meetings</p>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                            <Smile className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{emotionData.overallScore}/10</div>
                            <Progress value={emotionData.overallScore * 10} className="mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Positive Moments</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">65%</div>
                            <p className="text-xs text-muted-foreground mt-1">Of meeting duration</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Engagement Level</CardTitle>
                            <Smile className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">High</div>
                            <p className="text-xs text-muted-foreground mt-1">Above average</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Concerns Detected</CardTitle>
                            <Frown className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Emotion Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Emotion Timeline</CardTitle>
                            <CardDescription>How emotions evolved throughout the meeting</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={emotionData.timeline}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="timestamp" className="text-xs" />
                                    <YAxis domain={[0, 1]} className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="intensity"
                                        stroke="#9333ea"
                                        strokeWidth={3}
                                        dot={{ fill: "#9333ea", r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Emotion Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Emotion Distribution</CardTitle>
                            <CardDescription>Overall sentiment breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={emotionDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {emotionDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Speaker Emotion Breakdown */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Speaker Emotion Breakdown</CardTitle>
                        <CardDescription>Individual participant sentiment analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={speakerEmotionData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="speaker" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                    }}
                                />
                                <Bar dataKey="happy" stackId="a" fill={emotionColors.happy} />
                                <Bar dataKey="neutral" stackId="a" fill={emotionColors.neutral} />
                                <Bar dataKey="concerned" stackId="a" fill={emotionColors.concerned} />
                                <Bar dataKey="frustrated" stackId="a" fill={emotionColors.frustrated} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Detailed Speaker Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Speaker Analysis</CardTitle>
                        <CardDescription>Individual emotion profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(emotionData.speakerEmotions).map(([speaker, emotions]) => (
                            <div key={speaker} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {speaker.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{speaker}</h4>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                                <Smile className="h-3 w-3 mr-1" />
                                                {emotions.happy}% Happy
                                            </Badge>
                                            <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
                                                <Meh className="h-3 w-3 mr-1" />
                                                {emotions.neutral}% Neutral
                                            </Badge>
                                            {emotions.concerned > 0 && (
                                                <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                                    {emotions.concerned}% Concerned
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
