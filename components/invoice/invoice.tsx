"use client";

import React, { useRef } from "react";
import "./invoice.css"; // keep your custom CSS
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

interface InvoiceProps {
  booking?: {
    _id: string;
    user: {
      name: string;
      email: string;
    };
    room: {
      name: string;
    };
    amountPaid: number;
    checkInDate: string;
    checkOutDate: string;
    daysOfStay: number;
    status: string;
    date: string;
  };
}

const Invoice: React.FC<InvoiceProps> = ({ booking }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

const handleDownload = () => {
  const node = document.getElementById("booking_invoice");
  if (!node) return;

  // Options to preserve styles
  const options = {
    bgcolor: "#ffffff", // white background, change if you want
    style: {
      // force full width and proper fonts
      transform: "scale(1)",
      transformOrigin: "top left",
      fontFamily: "Arial, sans-serif",
    },
    width: node.scrollWidth,
    height: node.scrollHeight,
  };

  domtoimage.toBlob(node, options)
    .then((blob: Blob) => {
      if (blob) {
        saveAs(blob, `invoice_${booking?._id || "12345"}.png`);
      }
    })
    .catch((error: Error) => {
      console.error("Error generating invoice image:", error);
    });
};




  return (
    <div className="order-invoice my-10">
      <div className="flex justify-center mb-5">
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded flex items-center gap-2"
          onClick={handleDownload}
        >
          <i className="fa fa-download"></i> Download Invoice
        </button>
      </div>

      <div className="px-5" ref={invoiceRef}>
        <div
          id="booking_invoice"
          className="px-4 border border-gray-400 invoice-container"
        >
          <header className="clearfix">
            <div id="logo" className="my-4">
              <img src="/images/bookit_logo.png" alt="BookIT Logo" />
            </div>

            <h1 className="sm:text-sm sm:font-normal md:text-2xl md:font-bold mb-4">
              INVOICE # {booking?._id || "12345"}
            </h1>

            <div id="company" className="mb-4">
              <div className="font-semibold">BookIT</div>
              <div>
                455 Foggy Heights, <br />
                AZ 85004, US
              </div>
              <div>(602) 519-0450</div>
              <div>
                <a href="mailto:info@bookit.com" className="text-blue-500">
                  info@bookit.com
                </a>
              </div>
            </div>

            <div id="project" className="mb-4">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {booking?.user?.name || "John Doe"}
              </div>
              <div>
                <span className="font-semibold">EMAIL:</span>{" "}
                {booking?.user?.email || "johndoe@example.com"}
              </div>
              <div>
                <span className="font-semibold">DATE:</span>{" "}
                {booking?.date || "September 1, 2023"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    booking?.status === "PAID"
                      ? "text-green-700 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {booking?.status || "PAID"}
                </span>
              </div>
            </div>
          </header>

          <main>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-left">Room</th>
                    <th className="p-2 text-left">Price Paid</th>
                    <th className="p-2 text-left">Check In Date</th>
                    <th className="p-2 text-left">Check Out Date</th>
                    <th className="p-2 text-left">Days of Stay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="p-2">{booking?.room?.name || "Room Name"}</td>
                    <td className="p-2">Rs. {booking?.amountPaid?.toFixed(2) || "500.00"}</td>
                    <td className="p-2">{booking?.checkInDate || "Sep 1, 2023"}</td>
                    <td className="p-2">{booking?.checkOutDate || "Sep 5, 2023"}</td>
                    <td className="p-2">{booking?.daysOfStay || 4}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-2 font-bold text-right">GRAND TOTAL</td>
                    <td className="p-2 font-bold">Rs. {booking?.amountPaid?.toFixed(2) || "500.00"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="notices" className="mt-5">
              <div className="font-semibold">NOTICE:</div>
              <div className="notice text-sm text-gray-700">
                A finance charge of 1.5% will be made on unpaid balances after 30 days.
              </div>
            </div>
          </main>

          <footer className="pb-5 mt-5 text-sm text-gray-600">
            Invoice was created on a computer and is valid without the signature.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
