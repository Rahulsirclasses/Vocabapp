"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, FileJson, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Word {
    id: string
    word: string
    meaning: string
    difficulty: string
    createdAt: string
}

export default function WordManagementPage() {
    const [words, setWords] = useState<Word[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalWords, setTotalWords] = useState(0)
    const [sortBy, setSortBy] = useState("createdAt")
    const [order, setOrder] = useState("desc")

    // Form States
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isBulkOpen, setIsBulkOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [importProgress, setImportProgress] = useState("")
    const [importLogs, setImportLogs] = useState<string[]>([])
    const [isValidJson, setIsValidJson] = useState(false)
    const [jsonError, setJsonError] = useState("")

    // Single Add Form
    const [singleForm, setSingleForm] = useState({
        word: "",
        meaning: "",
        difficulty_level: "medium",
        // Optional fields can be added later or here
        example_sentence: "",
        synonyms: "", // comma separated
        antonyms: "" // comma separated
    })

    // Bulk Form
    const [bulkJson, setBulkJson] = useState("")

    useEffect(() => {
        fetchWords()
    }, [page, sortBy, order])

    const fetchWords = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/words?page=${page}&limit=20&sortBy=${sortBy}&order=${order}`)
            const data = await res.json()
            if (data.words) {
                setWords(data.words)
                setTotalPages(data.pagination.pages)
                setTotalWords(data.pagination.total)
            }
        } catch (error) {
            toast.error("Failed to fetch words")
        } finally {
            setLoading(false)
        }
    }

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const payload = {
                ...singleForm,
                synonyms: singleForm.synonyms.split(",").map(s => s.trim()).filter(Boolean),
                antonyms: singleForm.antonyms.split(",").map(s => s.trim()).filter(Boolean),
            }

            const res = await fetch("/api/admin/words", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Failed to add word")

            toast.success("Word added successfully")
            setIsAddOpen(false)
            setSingleForm({
                word: "",
                meaning: "",
                difficulty_level: "medium",
                example_sentence: "",
                synonyms: "",
                antonyms: ""
            })
            fetchWords() // Refresh list
        } catch (error) {
            toast.error("Failed to add word")
        } finally {
            setIsLoading(false)
        }
    }

    const validateJSON = () => {
        try {
            const data = JSON.parse(bulkJson)
            if (!Array.isArray(data)) {
                setJsonError("JSON must be an array of objects [{}, {}]")
                setIsValidJson(false)
                return false
            }
            if (data.length === 0) {
                setJsonError("Array is empty")
                setIsValidJson(false)
                return false
            }
            setJsonError("")
            setIsValidJson(true)
            toast.success(`Valid JSON! Ready to import ${data.length} words.`)
            return true
        } catch (e: any) {
            setJsonError("Invalid JSON: " + e.message)
            setIsValidJson(false)
            return false
        }
    }

    const handleBulkSubmit = async () => {
        if (!isValidJson && !validateJSON()) return

        setIsLoading(true)
        setImportLogs([])
        setImportProgress("Starting import...")

        try {
            const data = JSON.parse(bulkJson)
            const BATCH_SIZE = 50
            const totalBatches = Math.ceil(data.length / BATCH_SIZE)
            let successCount = 0

            for (let i = 0; i < totalBatches; i++) {
                setImportProgress(`Importing batch ${i + 1}/${totalBatches}...`)
                const batch = data.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)

                try {
                    const res = await fetch("/api/admin/words", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(batch)
                    })

                    const result = await res.json()

                    if (!res.ok) {
                        setImportLogs(prev => [...prev, `❌ Batch ${i + 1} Failed: ${result.error || "Unknown error"}`])
                    } else {
                        successCount += (result.count || 0)
                        if (result.duplicates > 0) {
                            setImportLogs(prev => [...prev, `⚠️ Batch ${i + 1}: Added ${result.count}, Skipped ${result.duplicates} duplicates`])
                        } else {
                            setImportLogs(prev => [...prev, `✅ Batch ${i + 1}: Added ${result.count} words`])
                        }
                    }
                } catch (err: any) {
                    setImportLogs(prev => [...prev, `❌ Batch ${i + 1} Network Error: ${err.message}`])
                }
            }

            setImportProgress("Completed!")
            toast.success(`Broad import completed. Added ${successCount} words.`)

            if (successCount > 0) {
                fetchWords()
            }
        } catch (error: any) {
            toast.error("Critical Import Error: " + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="text-slate-400 hover:text-white flex items-center mb-2">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Word Management</h1>
                        <p className="text-slate-400">Manage vocabulary database <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">{totalWords} words</span></p>
                    </div>
                    <div className="flex gap-3">
                        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                    <FileJson className="w-4 h-4 mr-2" />
                                    Bulk Import
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Bulk Import Words</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400">
                                        Paste a JSON array of word objects. Format:
                                        <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-x-auto text-amber-200/80">
                                            {`[
  {
    "word": "Example",
    "meaning": "Explanation",
    "difficulty_level": "medium",
    "synonyms": ["test"],
    "example_sentence": "This is a test."
  }
]`}
                                        </pre>
                                    </p>
                                    <Textarea
                                        value={bulkJson}
                                        onChange={(e) => {
                                            setBulkJson(e.target.value)
                                            setIsValidJson(false)
                                            setJsonError("")
                                        }}
                                        placeholder="Paste JSON here..."
                                        className={`h-48 bg-slate-950 border-slate-800 font-mono text-xs ${jsonError ? 'border-red-500/50' : ''}`}
                                    />

                                    {jsonError && (
                                        <p className="text-red-400 text-xs px-2">{jsonError}</p>
                                    )}

                                    {importLogs.length > 0 && (
                                        <div className="h-32 overflow-y-auto bg-black/40 rounded p-2 text-xs font-mono text-slate-300">
                                            {importLogs.map((log, i) => (
                                                <div key={i} className={log.startsWith("❌") ? "text-red-400" : log.startsWith("⚠️") ? "text-yellow-400" : "text-green-400"}>
                                                    {log}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={validateJSON}
                                            className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300"
                                        >
                                            Verify JSON
                                        </Button>
                                        <Button
                                            onClick={handleBulkSubmit}
                                            disabled={isLoading || !isValidJson}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    {importProgress}
                                                </>
                                            ) : "Import Words"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Select value={`${sortBy}-${order}`} onValueChange={(v) => {
                            const [s, o] = v.split("-")
                            setSortBy(s)
                            setOrder(o)
                            setPage(1) // Reset to first page on sort
                        }}>
                            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-white">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                <SelectItem value="word-asc">A to Z</SelectItem>
                                <SelectItem value="word-desc">Z to A</SelectItem>
                            </SelectContent>
                        </Select>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-indigo-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Word
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-700 text-white">
                                <DialogHeader>
                                    <DialogTitle>Add New Word</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSingleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Word</Label>
                                        <Input
                                            required
                                            value={singleForm.word}
                                            onChange={e => setSingleForm({ ...singleForm, word: e.target.value })}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Meaning</Label>
                                        <Textarea
                                            required
                                            value={singleForm.meaning}
                                            onChange={e => setSingleForm({ ...singleForm, meaning: e.target.value })}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Difficulty</Label>
                                            <Select
                                                value={singleForm.difficulty_level}
                                                onValueChange={v => setSingleForm({ ...singleForm, difficulty_level: v })}
                                            >
                                                <SelectTrigger className="bg-slate-950 border-slate-800">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                    <SelectItem value="easy">Easy</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="hard">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Example Sentence</Label>
                                        <Input
                                            value={singleForm.example_sentence}
                                            onChange={e => setSingleForm({ ...singleForm, example_sentence: e.target.value })}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Synonyms (comma separated)</Label>
                                        <Input
                                            value={singleForm.synonyms}
                                            onChange={e => setSingleForm({ ...singleForm, synonyms: e.target.value })}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    </div>
                                    <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Word"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Word List */}
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Word</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Meaning</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Difficulty</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading...</td>
                                    </tr>
                                ) : words.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No words found. Add some!</td>
                                    </tr>
                                ) : (
                                    words.map((word) => (
                                        <tr key={word.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{word.word}</td>
                                            <td className="px-6 py-4 text-slate-400 max-w-md truncate" title={word.meaning}>{word.meaning}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${word.difficulty === 'hard' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                    word.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                        'bg-green-500/20 text-green-400 border-green-500/30'
                                                    }`}>
                                                    {word.difficulty.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(word.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-slate-400">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>

    )
}
