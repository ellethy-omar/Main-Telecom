import FormInput from "../Form/FormInput";

const ProfileEditForm = ({ form, setForm, onSave, onCancel }) => {
  return (
    <>
      <div className="mb-2">
        <FormInput
          id="firstName"
          name="firstName"
          type="text"
          label="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <FormInput
          id="lastName"
          name="lastName"
          type="text"
          label="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <FormInput
          id="phone"
          name="phone"
          type="text"
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="text-gray-500 hover:underline"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ProfileEditForm;