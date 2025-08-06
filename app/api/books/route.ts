import { NextResponse } from 'next/server'

const BOOKS = [
    { id: 1, name: "React в действии" },
    { id: 2, name: "JavaScript: Подробное руководство" },
    { id: 3, name: "CSS для профи" }
]

export async function GET() {
    return NextResponse.json(BOOKS)
} 