import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import CallsTable from "./CallsTable.jsx";
import CallsNewCall from "./CallsNewCall.jsx";
import AlertOverlayed from "../Alert/AlertOverlayed.jsx";
import Alert from "../Alert/Alert.jsx";
import { callsService } from "../../services/callsService.js";
import CallsHeader from "./CallsHeader.jsx";

const CallsBigContainer = ({ calls, setCalls, contacts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [newCall, setNewCall] = useState({ phone: "", durationSeconds: "", summary: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const addCall = async () => {
    try {
      const created = await callsService.createCall(newCall);
      console.log(created);

      const newCalls = await callsService.getCallsForMe();

      setCalls(newCalls.data);
      setShowAddModal(false);
      setNewCall({ phone: "", durationSeconds: "", summary: "" });
      setAlert({
        message: "Call added successfully!",
        type: "success"
      });
    } catch (err) {
      setAlert({
        message: "Error in adding call!",
        type: "danger"
      });

      console.error(err);
    }
  };

  const saveSummary = async (id, summary) => {
    try {
      await callsService.updateCallSummary(id, summary);
      setCalls(prev =>
        prev.map(c => c.callId === id ? { ...c, summary } : c)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await callsService.deleteCall(deleteTarget.callId);
      setCalls(prev => prev.filter(c => c.callId !== deleteTarget.callId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <CallsHeader setShowAddModal={setShowAddModal} />

      { calls && <CallsTable calls={calls} setDeleteTarget={setDeleteTarget} saveSummary={saveSummary} /> }

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <CallsNewCall
            newCall={newCall}
            setNewCall={setNewCall}
            setShowAddModal={setShowAddModal}
            addCall={addCall}
            contacts={contacts}
          />
        )}
      </AnimatePresence>

      {deleteTarget && (
        <AlertOverlayed
          message={`Delete call for ${deleteTarget.contactFirstName} ${deleteTarget.contactLastName}?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {alert && 
        <Alert 
          message={alert.message}
          type={alert.type}
          onClose={()=> setAlert(null)}
        />}
    </div>
  );
};

export default CallsBigContainer;
