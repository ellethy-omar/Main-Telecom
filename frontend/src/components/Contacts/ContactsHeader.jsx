const ContactsHeader = ({handleCreateContact})=> {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Contacts</h2>
            <button
                onClick={handleCreateContact}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition flex items-center justify-center w-10 h-10"
                title="Add new contact"
            >
                <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
}

export default ContactsHeader;