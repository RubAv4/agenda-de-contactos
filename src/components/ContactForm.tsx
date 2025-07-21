import { useState, useEffect } from "react";
import { Contact } from "../types/Contact.tsx";

interface ContactFormProps {
  onSubmit: (contact: Omit<Contact, "id">) => void;
  editingContact: Contact | null;
  onUpdate: (contact: Contact) => void;
  onCancelEdit: () => void;
}

function ContactForm({
  onSubmit,
  editingContact,
  onUpdate,
  onCancelEdit,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<
    "personal" | "trabajo" | "emergencia"
  >("personal");
  const [address, setAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (editingContact) {
      setName(editingContact.name);
      setPhone(editingContact.phone);
      setEmail(editingContact.email);
      setCategory(editingContact.category);
      setAddress(editingContact.address);
      setPhotoUrl(editingContact.photoUrl);
    } else {
      setName("");
      setPhone("");
      setEmail("");
      setCategory("personal");
      setAddress("");
      setPhotoUrl("");
    }
  }, [editingContact]);

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarTelefono = (phone: string): boolean => {
    return /^\d{6,}$/.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert("Todos los campos obligatorios deben completarse.");
      return;
    }

    if (!validarTelefono(phone.trim())) {
      alert("El teléfono debe tener al menos 6 números.");
      return;
    }

    if (!validarEmail(email.trim())) {
      alert("El correo no es válido.");
      return;
    }

    const newContact = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      category,
      address: address.trim(),
      photoUrl: photoUrl.trim(),
    };

    if (editingContact) {
      onUpdate({ ...editingContact, ...newContact });
    } else {
      onSubmit(newContact);
    }

    setName("");
    setPhone("");
    setEmail("");
    setCategory("personal");
    setAddress("");
    setPhotoUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Nombre*:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono*:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo*:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoría:</label>
        <select
          id="category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as "personal" | "trabajo" | "emergencia")
          }
        >
          <option value="personal">Personal</option>
          <option value="trabajo">Trabajo</option>
          <option value="emergencia">Emergencia</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="address">Dirección:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="photoUrl">Foto (URL):</label>
        <input
          type="url"
          id="photoUrl"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingContact ? "Actualizar" : "Agregar"}
        </button>
        {editingContact && (
          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ContactForm;
