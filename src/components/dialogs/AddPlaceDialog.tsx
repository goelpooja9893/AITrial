import { useState, useEffect, useRef } from "react"
import { searchPlaces } from "../../lib/geocoding"
import { compressImage } from "../../lib/image"
import { PlaceInput } from "../../types"
import { Button } from "../common/Button"
import { Input } from "../common/Input"
import { Plus, Loader2, MapPin, Image as ImageIcon, X } from "lucide-react"

interface AddPlaceDialogProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (place: PlaceInput, date: string, notes: string, image?: string) => void
}

export function AddPlaceDialog({ isOpen, onClose, onAdd }: AddPlaceDialogProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<PlaceInput[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState<PlaceInput | null>(null)
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState("")
    const [image, setImage] = useState<string | null>(null)
    const [isCompressing, setIsCompressing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 3) {
                setLoading(true)
                const places = await searchPlaces(query)
                setResults(places)
                setLoading(false)
            } else {
                setResults([])
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [query])

    if (!isOpen) return null

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsCompressing(true)
            try {
                const compressed = await compressImage(file)
                setImage(compressed)
            } catch (error) {
                console.error("Image compression failed", error)
            } finally {
                setIsCompressing(false)
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedPlace) {
            onAdd(selectedPlace, date, notes, image || undefined)
            // Reset
            setQuery("")
            setSelectedPlace(null)
            setNotes("")
            setImage(null)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" />
                        Add New Place
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {!selectedPlace ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search Location</label>
                            <Input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Where did you go? (e.g. Paris)"
                                autoFocus
                            />

                            {loading && <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Searching...</div>}

                            <div className="max-h-[200px] overflow-y-auto space-y-1 mt-2">
                                {results.map((place, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            setSelectedPlace(place)
                                            setQuery(place.name)
                                            setResults([])
                                        }}
                                        className="w-full text-left p-2 hover:bg-slate-100 rounded-md text-sm flex items-start gap-2"
                                    >
                                        <MapPin className="h-4 w-4 mt-0.5 text-slate-400" />
                                        <div>
                                            <div className="font-medium">{place.name}</div>
                                            <div className="text-xs text-muted-foreground">{place.country}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-primary/10 p-3 rounded-md flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-primary">{selectedPlace.name}</span>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedPlace(null)}>Change</Button>
                            </div>

                            <div>
                                <label className="text-sm font-medium">When did you visit?</label>
                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Notes</label>
                                <Input
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Memories, food, rating..."
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-2">Photo</label>
                                <div className="flex items-center gap-4">
                                    {image ? (
                                        <div className="relative h-20 w-20 rounded-lg overflow-hidden border">
                                            <img src={image} alt="Preview" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImage(null)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isCompressing}
                                        >
                                            {isCompressing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                                            {isCompressing ? "Processing..." : "Upload Photo"}
                                        </Button>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={!selectedPlace || isCompressing}>Save Memory</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
