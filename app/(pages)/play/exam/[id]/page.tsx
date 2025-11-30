import React from "react";
import ExamPaperScreen from "./ExamPaperScreen";
import { serverIp } from "@/lib/serverIp";

async function getExam(examId: string) {
    try {
        console.log(`Fetching exam from: ${serverIp}/exam/${examId}`);
        const res = await fetch(`${serverIp}/exam/${examId}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`Fetch failed: ${res.status} ${res.statusText}`, text);
            throw new Error(`Failed to fetch exam: ${res.status}`);
        }
        const data = await res.json();
        return data.exam;
    } catch (error) {
        console.error("Error in getExam:", error);
        return null;
    }
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const exam = await getExam(id);

    if (!exam) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Examen introuvable</h1>
                    <p className="text-gray-400 mt-2">ID: {id}</p>
                </div>
            </div>
        );
    }

    return <ExamPaperScreen exam={exam} />;
}
