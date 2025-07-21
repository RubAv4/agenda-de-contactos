import { Contact } from "../types/Contact.tsx";

interface ContactListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onEdit: (contact: Contact) => void;
}

function ContactList({ contacts, onDelete, onEdit }: ContactListProps) {
  // Agrupar contactos por inicial
  const groupedContacts = contacts.reduce((groups, contact) => {
    const initial = contact.name.charAt(0).toUpperCase();
    if (!groups[initial]) {
      groups[initial] = [];
    }
    groups[initial].push(contact);
    return groups;
  }, {} as Record<string, Contact[]>);

  // Ordenar letras alfabéticamente
  const sortedInitials = Object.keys(groupedContacts).sort();

  return (
    <div className="contact-list">
      {contacts.length === 0 ? (
        <p className="empty-message">No hay contactos agregados</p>
      ) : (
        sortedInitials.map((initial) => (
          <div key={initial}>
            <h3 className="initial-letter">{initial}</h3>
            <ul>
              {groupedContacts[initial].map((contact) => (
                <li key={contact.id} className="contact-item">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    {contact.photoUrl && (
                      <img
                        src={contact.photoUrl}
                        alt="Foto"
                        width={64}
                        height={64}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    )}
                    <div>
                      <strong>{contact.name}</strong>
                      <p>📞 {contact.phone}</p>
                      <p>📧 {contact.email}</p>
                      <p>🏷️ {contact.category}</p>
                      <p>📍 {contact.address}</p>
                      <p>
                        📅 Creado el:{" "}
                        {new Date(parseInt(contact.id)).toLocaleDateString(
                          "es-PE",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="contact-actions">
                    <button onClick={() => onEdit(contact)}>Editar</button>
                    <button onClick={() => onDelete(contact.id)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default ContactList;
