"use client";

import { IBooking } from "@/backend/models/booking";
import React, { useState } from "react";
import Link from "next/link";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  data: {
    bookings: IBooking[];
  };
}

const MyBookings = ({ data }: Props) => {
  const bookings = data?.bookings ?? [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-red-700">My Bookings</h1>

      <Table className="border border-red-200 shadow-sm shadow-red-100 ">
        <TableCaption className="text-gray-500">A list of all your bookings</TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-red-200 rounded">
            <TableHead className="border-r border-red-200 rounded">ID</TableHead>
            <TableHead className="border-r border-red-200 rounded">Check In</TableHead>
            <TableHead className="border-r border-red-200 rounded">Check Out</TableHead>
            <TableHead className="border-r border-red-200 rounded">Amount Paid</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentBookings.map((booking) => (
            <TableRow
              key={String(booking._id)}
              className="border-b border-red-200 hover:bg-gray-50"
            >
              <TableCell className="font-medium border-r border-red-200">
                {String(booking._id)}
              </TableCell>
              <TableCell className="border-r border-red-200">
                {new Date(booking.checkInDate).toLocaleString("en-US")}
              </TableCell>
              <TableCell className="border-r border-red-200">
                {new Date(booking.checkOutDate).toLocaleString("en-US")}
              </TableCell>
              <TableCell className="border-r border-red-200">
                ${booking.amountPaid}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                  className="bg-red-700 text-white hover:bg-red-800"
                >
                  <Link href={`/bookings/${booking._id}`}>
                    View
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-red-700 text-white hover:bg-red-800"
                >
                  <Link href={`/bookings/invoice/${booking._id}`}>
                    Invoice
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          size="sm"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-red-100 shadow-sm shadow-red-100 disabled:bg-gray-50 disabled:text-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>

        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            size="sm"
            className={`border border-red-100 shadow-sm shadow-red-100 ${
              currentPage === idx + 1
                ? "bg-red-700 text-white hover:bg-red-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}

        <Button
          size="sm"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-red-100 shadow-sm shadow-red-100 disabled:bg-gray-50 disabled:text-gray-400"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MyBookings;
 