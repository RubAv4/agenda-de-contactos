import { useState, useEffect } from "react";
import { Contact } from "./types/Contact.tsx";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

type SortOption = "name-asc" | "name-desc" | "date";

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  // Cargar contactos al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem("contacts");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setContacts(parsed);
          console.log("Contactos cargados desde localStorage ✅");
        }
      }
    } catch (error) {
      console.error("Error cargando contactos ❌", error);
    }
  }, []);

  // Guardar cambios
  useEffect(() => {
    try {
      localStorage.setItem("contacts", JSON.stringify(contacts));
    } catch (error) {
      console.error("Error guardando contactos ❌", error);
    }
  }, [contacts]);

  const handleAddContact = (contact: Omit<Contact, "id">) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const handleDeleteContact = (id: string) => {
    const confirmDelete = window.confirm("¿Deseas eliminar este contacto?");
    if (confirmDelete) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleUpdateContact = (updated: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingContact(null);
  };

  const filteredContacts = contacts
    .filter((c) => {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.lastName?.toLowerCase().includes(term) || // por si lo tienes como campo opcional
        c.email?.toLowerCase().includes(term) ||
        c.phone.includes(term)
      );
    })

    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return Number(a.id) - Number(b.id); // fecha (por timestamp)
    });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Agenda de Contactos</h1>
        <ThemeToggle />
      </header>

      <main className="app-main">
        <section className="form-section">
          <h2 className="section-title">
            {editingContact ? "Editar Contacto" : "Agregar Contacto"}
          </h2>
          <ContactForm
            onSubmit={handleAddContact}
            editingContact={editingContact}
            onUpdate={handleUpdateContact}
            onCancelEdit={() => setEditingContact(null)}
          />
        </section>

        <section className="contacts-section">
          <h2 className="section-title">Lista de Contactos</h2>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {/* 🔄 Selector de orden */}
          <div className="sort-options">
            <label htmlFor="sort">Ordenar por:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="date">Fecha de creación</option>
            </select>
          </div>

          <ContactList
            contacts={filteredContacts}
            onDelete={handleDeleteContact}
            onEdit={handleEditContact}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
