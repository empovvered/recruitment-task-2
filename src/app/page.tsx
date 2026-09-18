import { AddDocumentButton } from "./_components/addDocumentButton/addDocumentButton"

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Dokumenty</h1>
        <p className="text-base text-gray-600">
          Dodaj dokument do weryfikacji. Formularz otwiera się w oknie modalnym.
        </p>
      </div>
      <div>
        <AddDocumentButton />
      </div>
    </main>
  )
}
