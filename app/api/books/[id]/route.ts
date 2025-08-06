import { NextRequest, NextResponse } from 'next/server'

interface BookDetails {
    id: number
    name: string
    author: string
    price: string
}

const BOOKS_DETAILS: Record<string, BookDetails> = {
    '1': { id: 1, name: "React в действии", author: "Марк Тилен Томас", price: "2500 руб." },
    '2': { id: 2, name: "JavaScript: Подробное руководство", author: "Дэвид Флэнаган", price: "3200 руб." },
    '3': { id: 3, name: "CSS для профи", author: "Кит Грант", price: "1800 руб." }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const book = BOOKS_DETAILS[id]

    if (!book) {
        return new NextResponse('Book not found', { status: 404 })
    }

    return NextResponse.json(book)
} 