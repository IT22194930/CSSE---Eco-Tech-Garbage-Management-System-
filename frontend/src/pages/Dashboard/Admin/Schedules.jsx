import { useNavigate } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { BlobProvider } from "@react-pdf/renderer";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import { writeFile } from "xlsx";
import ReqReport from "./Reports/ScheduleReports";

const Schedules = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reqFilter, setReqFilter] = useState("");
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    axiosFetch
      .get("/api/garbageRequests")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredReq = requests.filter((request) => {
    const matchesSearch =
      request?.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request?.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReq = reqFilter
      ? request?.type?.toLowerCase() === reqFilter.toLowerCase()
      : true;

    return matchesSearch && matchesReq;
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete the schedule?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete schedule!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/api/garbageRequests/${id}`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "You have successfully deleted the schedule.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const generateExcelFile = () => {
    const filteredDataList = filteredReq.map((request) => ({
      Name: request.username,
      Type: request.type,
      Description: request.description,
      Date: new Date(request.date).toLocaleDateString(),
      Time: request.time,
      Status: request.status,
      RecyclableQuantity: request.recyclableQuantity,
      CashbackPrice: request.cashbackPrice,
      TotalCost: request.totalCost,
      CreatedAt: new Date(request.createdAt).toLocaleString(),
    }));
  
    if (filteredDataList.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "There are no records to export.",
        icon: "info",
      });
      return;
    }
  
    const ws = XLSX.utils.json_to_sheet(filteredDataList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Request Report");
    writeFile(wb, "request_report.xlsx");
  };
  
  const handleButtonClick = () => {
    generateExcelFile();
  };

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-center text-4xl font-bold my-7">Schedules</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search pending requests by name or type"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md "
        />

      <select
        value={reqFilter}
        onChange={(e) => setReqFilter(e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="">All Types</option>
        <option value="normal waste">Normal Waste</option>
        <option value="e waste">E Waste</option>
        <option value="bulk">Bulk Waste</option>
        <option value="hazardous waste">Hazardous Waste</option>
        <option value="other special waste">Other Special Waste</option>
      </select>

      <BlobProvider
          document={<ReqReport dataList={filteredReq} />}
          fileName="SchedulesReport.pdf"
        >
          {({ url }) => (
            <li className="flex items-center">
              <a href={url} target="_blank" className="flex items-center">
                <FaFilePdf className="text-3xl text-red-600" />
              </a>
            </li>
          )}
        </BlobProvider>

        <li className="flex items-center">
          <a href="#" onClick={handleButtonClick} className="flex items-center">
            <FaFileExcel className="text-3xl text-green-600" />
          </a>
        </li>
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-3">
            <div className="overflow-hidden">
              {filteredReq.length === 0 ? (
                <p className="text-center text-gray-500">No schedules found.</p>
              ) : (
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium hidden md:table-header-group">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-4 ">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Description
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Time
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Recyclable Quantity
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Cashback Price
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Total Cost
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReq.map((request, idx) => (
                      <tr
                        key={request._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium">
                          {request?.username}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-medium">
                          {request?.type}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {request?.description}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {new Date(request?.date).toLocaleDateString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {request?.time}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {request?.status}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {request?.recyclableQuantity}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {request?.cashbackPrice}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {request?.totalCost}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {new Date(request?.createdAt).toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() => handleDelete(request._id)}
                            className="inline-flex items-center gap-2 cursor-pointer bg-red-600 py-1 rounded-md px-2 text-white"
                          >
                            Delete <MdDelete className="text-white" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
