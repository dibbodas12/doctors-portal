import { format } from "date-fns/esm";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Contexts/AuthProvider";

const BookingModal = ({ treatment, selectedDate, setTreatment }) => {
  const { name: treatmentName, slots } = treatment;
  const { user } = useContext(AuthContext);
  const date = format(selectedDate, "PP");

  const handleBooking = (event) => {
    event.preventDefault();
    const form = event.target;
    const slot = form.slot.value;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;

    const booking = {
      appointmentDate: date,
      treatment: treatmentName,
      patient: name,
      slot,
      email,
      phone,
    };
    fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          
          setTreatment(null);
          toast.success("Booking Confirmed");
        }
      });
  };

  return (
    <>
      <input type="checkbox" id="booking-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="booking-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">{treatmentName}</h3>
          <form
            onSubmit={handleBooking}
            className="grid grid-cols-1 gap-3 mt-6"
          >
            <input
              type="text"
              disabled
              value={date}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
            <select name="slot" className="select select-bordered w-full">
              {slots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <input
              name="name"
              type="text"
              defaultValue={user?.displayName}
              placeholder="Your Name"
              className="input input-bordered w-full"
            />
            <input
              name="email"
              defaultValue={user?.email}
              disabled
              type="email"
              placeholder="Email Address"
              className="input input-bordered w-full"
            />
            <input
              name="phone"
              type="text"
              placeholder="Phone Number"
              className="input input-bordered w-full"
            />
            <br />
            <input
              value="submit"
              type="submit"
              className=" btn btn-accent w-full"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingModal;
