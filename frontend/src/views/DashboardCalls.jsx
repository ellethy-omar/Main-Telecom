import { useEffect, useState } from "react";
import CallsBigContainer from "../components/Calls/CallsBigContainer";
import { callsService } from "../services/callsService";
import { contactsService } from "../services/contactsService";

const DashboardCalls = () => {
  const [calls, setCalls] =  useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchCalls = async () => {
      const fetchedCalls = await callsService.getCallsForMe();

      console.log(fetchedCalls.data);
    
      setCalls(fetchedCalls.data);
    };

    fetchCalls();
  }, [])

  useEffect(()=> {
    const fetchContacts = async () => {
      const fetchedContacts = await contactsService.getAllContacts();

      console.log(fetchedContacts);

      setContacts(fetchedContacts);
    }

    fetchContacts();
  }, []);


  return (
    <>
      <div className="p-10 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold mb-6">Your Call History</h1>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <CallsBigContainer 
          calls={calls} 
          setCalls={setCalls}
          contacts={contacts} 
          />
        </div>
      </div>
    </>
  );
};

export default DashboardCalls;
