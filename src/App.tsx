import { useState } from "react";
import "./App.css";
import CalendarModal from "./components/Calendar";

function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && (
        <CalendarModal showModal={showModal} setShowModal={setShowModal} />
      )}
      <p className="text-2xl text-white">Calendar Project</p>
      <div className="card">
        <button
          className="bg-black text-white border-0 p-1.5 rounded-sm cursor-pointer"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Calendar View
        </button>
      </div>
    </>
  );
}

export default App;
